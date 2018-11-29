import './SafeMath.sol';
import './Stoppable.sol';
import './MintableNFT.sol';


contract eth2giftEscrow is Stoppable {
  using SafeMath for uint256;

  // fixed amount of wei accrued to verifier with each transfer
  uint public commissionFee;

  // verifier can withdraw this amount from smart-contract
  uint public commissionToWithdraw; // in wei

  // verifier's address
  address public verifier;

  // verifier's address
  enum Statuses { Empty, Deposited, Claimed, Cancelled }


  mapping (address => address) sellers;

  struct Gift {
    address sender;
    uint amount; // in wei
    address tokenAddress;
    uint256 tokenId;
    Statuses status;
  }

  // Mappings of transitAddress => Transfer Struct
  mapping (address => Gift) gifts;

  /*
   * EVENTS
   */
  event LogBuy(
	       address indexed transitAddress,
	       address indexed sender,
	       address indexed tokenAddress,
	       uint tokenId,
	       uint amount,
	         uint commission
	       );

  event LogCancel(
		  address indexed transitAddress,
		  address indexed sender,
		  address indexed tokenAddress,
		    uint tokenId
		  );

  event LogWithdraw(
		    address indexed transitAddress,
		    address indexed sender,
		    address indexed tokenAddress,
		    uint tokenId,
		    address recipient,
		        uint amount
		    );

  event LogWithdrawCommission(uint commissionAmount);

  event LogChangeFixedCommissionFee(
				    uint oldCommissionFee,
				        uint newCommissionFee
				    );

  event LogChangeVerifier(
			  address oldVerifier,
			    address newVerifier
			  );


  /**
   * @dev Contructor that sets msg.sender as owner (verifier) in Ownable
   * and sets verifier's fixed commission fee.
   * @param _commissionFee uint Verifier's fixed commission for each transfer
   */
  constructor(uint _commissionFee,
	                  address _tokenAddress
	      //address _verifier,
	      ) public {
    commissionFee = _commissionFee;
    //verifier = _verifier;
    verifier = msg.sender;
  }


  modifier onlyVerifier() {
    require(msg.sender == verifier);
    _;
  }

  function addSeller(address _sellerAddress, address _tokenAddress) {
    sellers[_tokenAddress] = _sellerAddress;
  }

  function canBuyGiftLink(address _tokenAddress, uint _tokenId, address _transitAddress) public returns (bool) {
    require(msg.value > commissionFee);

    // can not override existing gift
    require(gifts[_transitAddress].status == Statuses.Empty);

    // check that nft wasn't sold before
    MintableNFT nft = MintableNFT(_tokenAddress);
    require(nft.ownerOf(_tokenId) == sellers[_tokenAddress]);

    return true;
  }


  function buyGiftLink(address _tokenAddress, uint _tokenId, address _transitAddress)
          payable public
            whenNotPaused
    whenNotStopped returns (bool) {

    require(canBuyGiftLink(_tokenAddress, _tokenId, _transitAddress));

    uint amount = msg.value.sub(commissionFee); //amount = msg.value - comission

    // saving transfer details
    gifts[_transitAddress] = Gift(
				  msg.sender,
				  amount,
				  _tokenAddress,
				  _tokenId,
				                          Statuses.Deposited
				  );

    // accrue verifier's commission
    commissionToWithdraw = commissionToWithdraw.add(commissionFee);

    // send nft
    MintableNFT nft = MintableNFT(_tokenAddress);
    nft.transferFrom(sellers[_tokenAddress], address(this), _tokenId);

    // log buy event
    emit LogBuy(
		_transitAddress,
		msg.sender,
		_tokenAddress,
		_tokenId,
		amount,
		commissionFee);
    return true;
  }

  /**
   * @dev Change verifier's fixed commission fee.
   * Only owner can change commision fee.
   * 
   * @param _newCommissionFee uint New verifier's fixed commission
   * @return True if success.
   */
  function changeFixedCommissionFee(uint _newCommissionFee)
                              public
                              whenNotPaused
                              whenNotStopped
                              onlyOwner
    returns(bool success)
  {
    uint oldCommissionFee = commissionFee;
    commissionFee = _newCommissionFee;
    emit LogChangeFixedCommissionFee(oldCommissionFee, commissionFee);
    return true;
  }


  /**
   * @dev Change verifier's address.
   * Only owner can change verifier's address.
   * 
   * @param _newVerifier address New verifier's address
   * @return True if success.
   */
  function changeVerifier(address _newVerifier)
                              public
                              whenNotPaused
                              whenNotStopped
                              onlyOwner
    returns(bool success)
  {
    address oldVerifier = verifier;
    verifier = _newVerifier;
    emit LogChangeVerifier(oldVerifier, verifier);
    return true;
  }


  /**
   * @dev Transfer accrued commission to verifier's address.
   * @return True if success.
   */
  function withdrawCommission()
                            public
                            whenNotPaused
    returns(bool success)
  {
    uint commissionToTransfer = commissionToWithdraw;
    commissionToWithdraw = 0;
    owner.transfer(commissionToTransfer); // owner is verifier

    emit LogWithdrawCommission(commissionToTransfer);
    return true;
  }

  /**
   * @dev Get transfer details.
   * @param _transitAddress transit address assigned to transfer
   * @return Transfer details (sender, amount, tokenId)
   */
  function getGift(address _transitAddress)
                public
                view

    returns (
	     address sender, // transfer sender
	     uint amount,
	     address tokenAddress,
	     uint256 tokenId,
	     Statuses status,
	          string tokenURI
	     ) // in wei
  {
    Gift memory gift = gifts[_transitAddress];

    MintableNFT nft = MintableNFT(gift.tokenAddress);

    return (
	    gift.sender,
	    gift.amount,
	    gift.tokenAddress,
	    gift.tokenId,
	    gift.status,
	    nft.tokenURI(gift.tokenId)
	    );
  }


  /**
   * @dev Cancel transfer and get sent ether back. Only transfer sender can
   * cancel transfer.
   * @param _transitAddress transit address assigned to transfer
   * @return True if success.
   */
  function cancelTransfer(address _transitAddress) public returns (bool success) {
    Gift memory gift = gifts[_transitAddress];

    // only sender can cancel transfer;
    require(msg.sender == gift.sender);

    gift.status = Statuses.Cancelled;

    // transfer ether to recipient's address
    gift.sender.transfer(gift.amount);

    // send nft
    ERC721 nft = ERC721(gift.tokenAddress);
    nft.transferFrom(address(this), msg.sender, gift.tokenId);

    // log cancel event
    emit LogCancel(_transitAddress, msg.sender, gift.tokenAddress, gift.tokenId);

    return true;
  }

  /**
   * @dev Verify that address is signed with correct verification private key.
   * @param _transitAddress transit address assigned to transfer
   * @param _recipient address Signed address.
   * @param _v ECDSA signature parameter v.
   * @param _r ECDSA signature parameters r.
   * @param _s ECDSA signature parameters s.
   * @return True if signature is correct.
   */
  function verifySignature(
			   address _transitAddress,
			   address _recipient,
			   uint8 _v,
			   bytes32 _r,
			   bytes32 _s)
    public pure returns(bool success)
  {
    bytes32 prefixedHash = keccak256("\x19Ethereum Signed Message:\n32", _recipient);
    address retAddr = ecrecover(prefixedHash, _v, _r, _s);
    return retAddr == _transitAddress;
  }


  /**
   * @dev Verify that address is signed with correct verification private key.
   * @param _transitAddress transit address assigned to transfer
   * @param _recipient address Signed address.
   * @param _v ECDSA signature parameter v.
   * @param _r ECDSA signature parameters r.
   * @param _s ECDSA signature parameters s.
   * @return True if signature is correct.
   */
  function canWithdraw(
		       address _transitAddress,
		       address _recipient,
		       uint8 _v,
		       bytes32 _r,
		       bytes32 _s)
    public constant returns(bool success)
  {

    Gift memory gift = gifts[_transitAddress];

    // verifying signature
    require(verifySignature(_transitAddress,
			    _recipient, _v, _r, _s ));

    // wasn't withdrawn before
    require(gift.status == Statuses.Deposited);

    return true;
  }



  /**
   * @dev Withdraw transfer to recipient's address if it is correctly signed
   * with private key for verification public key assigned to transfer.
   * 
   * @param _transitAddress transit address assigned to transfer
   * @param _recipient address Signed address.
   * @param _v ECDSA signature parameter v.
   * @param _r ECDSA signature parameters r.
   * @param _s ECDSA signature parameters s.
   * @return True if success.
   */
  function withdraw(
		    address _transitAddress,
		    address _recipient,
		    uint8 _v,
		    bytes32 _r,
		        bytes32 _s
		    )
        public
        whenNotPaused
        whenNotStopped
    returns (bool success)
  {
    Gift memory gift = gifts[_transitAddress];

    // verifying signature
    require(canWithdraw(_transitAddress,
			_recipient, _v, _r, _s ));

    gift.status = Statuses.Claimed;

    // send nft
    ERC721 nft = ERC721(gift.tokenAddress);
    nft.transferFrom(address(this), _recipient, gift.tokenId);

    // transfer ether to recipient's address
    _recipient.transfer(gift.amount);

    // log withdraw event
    emit LogWithdraw(_transitAddress, gift.sender, gift.tokenAddress, gift.tokenId, _recipient, gift.amount);

    return true;
  }

  // fallback function - do not receive ether by default
  function() public payable {
    revert();
  }
}
