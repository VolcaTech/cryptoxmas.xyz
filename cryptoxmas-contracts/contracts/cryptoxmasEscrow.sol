pragma solidity ^0.4.25;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/math/Math.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import './NFT.sol';
import './GivethBridge.sol';


contract cryptoxmasEscrow is Pausable, Ownable {
  using SafeMath for uint256;
  using Math for uint256;  
  using ECDSA for bytes32;
  

  // fixed amount of wei accrued to verifier with each transfer
  uint public nftPrice;
  GivethBridge public givethBridge;
  uint64 givethReceiverId;

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

  event LogClaim(
		 address indexed transitAddress,
		 address indexed sender,
		 address indexed tokenAddress,
		 uint tokenId,
		 address recipient,
		 uint amount
		 );
  


  /**
   * @dev Contructor that sets msg.sender as owner (verifier) in Ownable
   * and sets verifier's fixed commission fee.
   * @param _nftPrice uint Verifier's fixed commission for each transfer
   */
  constructor(uint _nftPrice, GivethBridge _givethBridge, uint64 _givethReceiverId) public {
    nftPrice = _nftPrice;
    givethBridge = _givethBridge;
    givethReceiverId = _givethReceiverId;
  }


  function addSeller(address _sellerAddress, address _tokenAddress) public {
    sellers[_tokenAddress] = _sellerAddress;
  }

  function canBuyGiftLink(address _tokenAddress, uint _tokenId, address _transitAddress, uint _value) public view returns (bool) {
    require(_value >= nftPrice);

    // can not override existing gift
    require(gifts[_transitAddress].status == Statuses.Empty);

    // check that nft wasn't sold before
    NFT nft = NFT(_tokenAddress);
    require(nft.ownerOf(_tokenId) == sellers[_tokenAddress]);
    
    return true;
  }


  function buyGiftLink(address _tokenAddress, uint _tokenId, address _transitAddress)
          payable public whenNotPaused returns (bool) {

    require(canBuyGiftLink(_tokenAddress, _tokenId, _transitAddress, msg.value));

    uint amount = msg.value.sub(nftPrice); //amount = msg.value - comission

    // saving transfer details
    gifts[_transitAddress] = Gift(
				  msg.sender,
				  amount,
				  _tokenAddress,
				  _tokenId,
				  Statuses.Deposited
				  );

    // send nft
    NFT nft = NFT(_tokenAddress);
    nft.transferFrom(sellers[_tokenAddress], address(this), _tokenId);

    // log buy event
    emit LogBuy(
		_transitAddress,
		msg.sender,
		_tokenAddress,
		_tokenId,
		amount,
		nftPrice);
    return true;
  }


  /**
   * @dev Get transfer details.
   * @param _transitAddress transit address assigned to transfer
   * @return Transfer details (sender, amount, tokenId)
   */
  function getGift(address _transitAddress) public view returns (
	     address sender, // transfer sender
	     uint amount,
	     address tokenAddress,
	     uint256 tokenId,
	     Statuses status,
	     string tokenURI) {
    Gift memory gift = gifts[_transitAddress];
    
    NFT nft = NFT(gift.tokenAddress);

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
   * @dev Cancel gift and get sent ether back. Only gift buyer can
   * cancel.
   * @param _transitAddress transit address assigned to gift
   * @return True if success.
   */
  function cancelGift(address _transitAddress) public returns (bool success) {
    Gift storage gift = gifts[_transitAddress];

    // only sender can cancel transfer;
    require(msg.sender == gift.sender);

    gift.status = Statuses.Cancelled;

    // transfer ether to recipient's address
    gift.sender.transfer(gift.amount);

    // send nft
    NFT nft = NFT(gift.tokenAddress);
    nft.transferFrom(address(this), sellers[gift.tokenAddress], gift.tokenId);

    // log cancel event
    emit LogCancel(_transitAddress, msg.sender, gift.tokenAddress, gift.tokenId);

    return true;
  }

  /**
   * @dev Verify that address is signed with correct verification private key.
   * @param _transitAddress transit address assigned to gift
   * @param _recipient address Signed address.
   * @param _sig ECDSA signature parameter v.
   * @return True if signature is correct.
   */
  function verifySignature(
			   address _transitAddress,
			   address _recipient,
			   bytes _sig ) public pure returns(bool success) {

    // hash signed by receiver using transit private key
    bytes32 hash = keccak256(abi.encodePacked(_recipient,
					      _transitAddress));
    
    address signer = hash.toEthSignedMessageHash().recover(_sig);
    return signer == _transitAddress;
  }


  /**
   * @dev Verify that address is signed with correct verification private key.
   * @param _transitAddress transit address assigned to transfer
   * @param _recipient address Signed address.
   * @param _sig ECDSA signature
   * @return True if signature is correct.
   */
  function canClaim(
		       address _transitAddress,
		       address _recipient,
		       bytes _sig) public constant returns(bool success)  {

    Gift memory gift = gifts[_transitAddress];

    // verifying signature
    require(verifySignature(_transitAddress, _recipient, _sig));

    // wasn't withdrawn before
    require(gift.status == Statuses.Deposited);

    return true;
  }



  /**
   * @dev Claim gift to recipient's address if it is correctly signed
   * with private key for verification public key assigned to gift.
   * 
   * @param _transitAddress transit address assigned to transfer
   * @param _recipient address Signed address.
   * @param _sig ECDSA signature
   * @return True if success.
   */
  function claimGift(
		    address _transitAddress,
		    address _recipient,
		    bytes _sig) public whenNotPaused returns (bool success) {

    uint256 startingGas = gasleft();
    
    Gift storage gift = gifts[_transitAddress];
    
    // verifying signature
    require(canClaim(_transitAddress, _recipient, _sig));

    gift.status = Statuses.Claimed;

    // send nft
    NFT nft = NFT(gift.tokenAddress);
    nft.transferFrom(address(this), _recipient, gift.tokenId);

    // transfer ether to recipient's address
    if (gift.amount > 0) { 
      _recipient.transfer(gift.amount);
    }

    // log withdraw event
    emit LogClaim(_transitAddress, gift.sender, gift.tokenAddress, gift.tokenId, _recipient, gift.amount);

    uint256 gasUsed = startingGas.sub(gasleft());
    
    // refund gas cost to sender from nft price but not bigger than nft price
    uint toRefund = gasUsed.add(49000).mul(tx.gasprice).min(nftPrice);
    
    uint toCharity = nftPrice.sub(toRefund);
    if (toCharity > 0) {
      givethBridge.donateAndCreateGiver.value(toCharity)(gift.sender, givethReceiverId, 0, 0);
    }
    
    if (toRefund > 0) {
      msg.sender.transfer(toRefund);
    }
    
    return true;
  }

  // fallback function - do not receive ether by default
  function() public payable {
    revert();
  }
}
