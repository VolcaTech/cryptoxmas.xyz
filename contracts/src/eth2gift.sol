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

  address public NFT_ADDRESS;

  /*
   * EVENTS
   */
  event LogBuy(
	       address indexed sender,
	       address indexed transitAddress,
	       uint indexed  tokenId,
	       uint amount,
	         uint commission
	       );

  event LogCancel(
		  address indexed sender,
		  address indexed transitAddress,
		    uint indexed tokenId
		  );

  event LogWithdraw(
		    address indexed sender,
		    address indexed transitAddress,
		    uint indexed tokenId,
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

  struct Gift {
    address sender;
    uint amount; // in wei
    uint256 tokenId;
  }

  // Mappings of transitAddress => Transfer Struct
  mapping (address => Gift) gifts;


  /**
   * @dev Contructor that sets msg.sender as owner (verifier) in Ownable
   * and sets verifier's fixed commission fee.
   * @param _commissionFee uint Verifier's fixed commission for each transfer
   */
  constructor(uint _commissionFee,
	      address _verifier,
	      string _name,
	      string _symbol) public {
    commissionFee = _commissionFee;
    verifier = _verifier;
    NFT_ADDRESS = new MintableNFT(_name, _symbol);
  }


  modifier onlyVerifier() {
    require(msg.sender == verifier);
    _;
  }

  /**
   * @dev Deposit ether to smart-contract and create transfer.
   * Transit address is assigned to transfer by sender. 
   * Recipient should sign withrawal address with the transit private key 
   * 
   * @param _tokenId address assigned to transfer.
   * @param _transitAddress transit address assigned to transfer.

   * @return True if success.
   */
  function buyGiftLink(uint _tokenId, address _transitAddress)
          payable public
            whenNotPaused
            whenNotStopped
    onlyOwner returns (bool) {
    require(msg.value > commissionFee);

    // can not override existing gift
    require(gifts[_transitAddress].tokenId == 0);

    uint amount = msg.value.sub(commissionFee); //amount = msg.value - comission

    // saving transfer details
    gifts[_transitAddress] = Gift(
				  msg.sender,
				  amount,
				                          _tokenId
				  );

    // accrue verifier's commission
    commissionToWithdraw = commissionToWithdraw.add(commissionFee);

    // send nft
    MintableNFT nft = MintableNFT(NFT_ADDRESS);
    nft.mint(address(this), _tokenId);

    // log buy event
    emit LogBuy(
		msg.sender,
		_transitAddress,
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
  function getTransfer(address _transitAddress)
                public
                constant
    returns (
	     address sender, // transfer sender
	     uint amount,
	     uint256 tokenId) // in wei
  {
    Gift memory gift = gifts[_transitAddress];
    return (
	    gift.sender,
	    gift.amount,
	       gift.tokenId
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

    delete gifts[_transitAddress];

    // transfer ether to recipient's address
    gift.sender.transfer(gift.amount);

    // send nft
    ERC721 nft = ERC721(NFT_ADDRESS);
    nft.transferFrom(address(this), gift.sender, gift.tokenId);

    // log cancel event
    emit LogCancel(msg.sender, _transitAddress, gift.tokenId);

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

    // wasn't withdrawn before
    require(gift.tokenId != 0);

    // verifying signature
    require(verifySignature(_transitAddress,
			    _recipient, _v, _r, _s ));

    delete gifts[_transitAddress];

    // send nft
    ERC721 nft = ERC721(NFT_ADDRESS);
    nft.transferFrom(address(this), _recipient, gift.tokenId);

    // transfer ether to recipient's address
    _recipient.transfer(gift.amount);

    // log withdraw event
    emit LogWithdraw(gift.sender, _transitAddress, gift.tokenId, _recipient, gift.amount);

    return true;
  }

  // fallback function - do not receive ether by default
  function() public payable {
    revert();
  }
}
