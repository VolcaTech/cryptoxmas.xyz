pragma solidity ^0.4.25;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/math/Math.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import './NFT.sol';
//import './GivethBridge.sol';


contract CryptoxmasEscrow is Pausable, Ownable {
  using SafeMath for uint256;
  using Math for uint256;  
  using ECDSA for bytes32;
  

  // fixed amount of wei accrued to verifier with each transfer
  address public givethBridge;
  uint64 public givethReceiverId;

  // commission to fund paying gas for claim transactions
  // leftover eth will be donated to charity
  uint public EPHEMERAL_ADDRESS_FEE = 0.01 ether; 

  // verifier's address
  enum Statuses { Empty, Deposited, Claimed, Cancelled }

  struct Seller {
    address seller;
    uint nftPrice;
    mapping (uint => uint) uniquePrices; // tokenId => price
  }

  // tokenId 
  mapping (address => Seller) sellers;
  
  struct Gift {
    address sender;
    uint claimEth; // eth for receiver
    address tokenAddress;
    uint256 tokenId;
    Statuses status;
    uint nftPrice;
    string msgHash; // ifps message hash
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
	       uint claimEth,
	       uint nftPrice
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
		 address receiver,
		 uint claimEth
		 );

  event LogSellerAdded(
		 address sellerAddress,
		 address tokenAddress,
		 uint nftPrice
		 );
  

  /**
   * @dev Contructor that sets msg.sender as owner (verifier) in Ownable
   * and sets verifier's fixed commission fee.
   */
  constructor(address _givethBridge,
	      uint64 _givethReceiverId) public {
    givethBridge = _givethBridge;
    givethReceiverId = _givethReceiverId;
  }


  function addSeller(address _sellerAddress, address _tokenAddress, uint _sellerPrice) public onlyOwner {
    // can't add seller with cheaper nft price that EPHEMERAL_ADDRESS_FEE
    require(_sellerPrice >= EPHEMERAL_ADDRESS_FEE);
    
    // can't override existing seller
    require(sellers[_tokenAddress].seller == 0);

    // store seller
    sellers[_tokenAddress] = Seller(_sellerAddress, _sellerPrice);
    emit LogSellerAdded( _sellerAddress,  _tokenAddress,  _sellerPrice);
   
  }

  function canBuyGift(address _tokenAddress, uint _tokenId, address _transitAddress, uint _value) public view returns (bool) {
    Seller memory seller = sellers[_tokenAddress];    
    require(_value >= seller.nftPrice);

    // can not override existing gift
    require(gifts[_transitAddress].status == Statuses.Empty);

    // check that nft wasn't sold before
    NFT nft = NFT(_tokenAddress);
    require(nft.ownerOf(_tokenId) == sellers[_tokenAddress].seller);
    
    return true;
  }


  function buyGift(address _tokenAddress, uint _tokenId, address _transitAddress, string _msgHash)
          payable public whenNotPaused returns (bool) {

    Seller memory seller = sellers[_tokenAddress];
    
    require(canBuyGift(_tokenAddress, _tokenId, _transitAddress, msg.value));

    uint tokenPrice = _getTokenSalePrice( _tokenAddress, _tokenId);       
    uint claimEth = msg.value.sub(tokenPrice); //amount = msg.value - comission
    
    
    // saving transfer details
    gifts[_transitAddress] = Gift(
				  msg.sender,
				  claimEth,
				  _tokenAddress,
				  _tokenId,
				  Statuses.Deposited,
				  tokenPrice,
				  _msgHash
				  );

    // transfer NFT from seller's address to this escrow contract
    NFT nft = NFT(_tokenAddress);
    nft.transferFrom(seller.seller, address(this), _tokenId);

    // transfer ETH to relayer to fund claim txs
    _transitAddress.transfer(EPHEMERAL_ADDRESS_FEE);
    
    uint donation = tokenPrice.sub(EPHEMERAL_ADDRESS_FEE);
    if (donation > 0) {
      _makeDonation(msg.sender, donation);
    }
    
    // log buy event
    emit LogBuy(
		_transitAddress,
		msg.sender,
		_tokenAddress,
		_tokenId,
		claimEth,
		tokenPrice);
    return true;
  }


  function _makeDonation(address _giver, uint _value) internal returns (bool success) {
    bytes memory _data = abi.encodePacked(0x1870c10f, // function signature
					   bytes32(_giver),
					   bytes32(givethReceiverId),
					   bytes32(0),
					   bytes32(0));
    // make donation tx
    success = givethBridge.call.value(_value)(_data);
    return success;
  }

  
  function getGift(address _transitAddress) public view returns (
	     address sender, // transfer sender
	     uint claimEth,
	     address tokenAddress,
	     uint256 tokenId,
	     Statuses status,
	     string tokenURI,
	     uint nftPrice,
	     string msgHash) {
    Gift memory gift = gifts[_transitAddress];
    
    NFT nft = NFT(gift.tokenAddress);

    return (
	    gift.sender,
	    gift.claimEth,
	    gift.tokenAddress,
	    gift.tokenId,
	    gift.status,
	    nft.tokenURI(gift.tokenId),
	    gift.nftPrice,
	    gift.msgHash
	    );
  }


  function getSeller(address _tokenAddress) public view returns (address sellerAddress, uint nftPrice) {
    Seller memory seller = sellers[_tokenAddress];
    
    return (
	    seller.seller,
	    seller.nftPrice
	    );
  }

  function getTokenSaleInfo(address _tokenAddress, uint _tokenId) public view returns (uint price, string tokenURI) {
    NFT nft = NFT(_tokenAddress);
    price = _getTokenSalePrice(_tokenAddress, _tokenId);
    
    return (
	    price,
	    nft.tokenURI(_tokenId)
	    );
  }

  function _getTokenSalePrice(address _tokenAddress, uint _tokenId) internal view returns (uint price) {
    Seller storage seller = sellers[_tokenAddress];
    uint uniquePrice = seller.uniquePrices[_tokenId];
    // return unique or standard price (if no unique price for this token)
    if (uniquePrice >= EPHEMERAL_ADDRESS_FEE) {
      price = uniquePrice;
    } else {
      price = seller.nftPrice;
    }

    return price;
  }
  
  function setUniquePrice(address _tokenAddress, uint _tokenId, uint _price ) public returns (bool success) {
    // can't set nft price that less that EPHEMERAL_ADDRESS_FEE
    require(_price >= EPHEMERAL_ADDRESS_FEE);

    Seller storage seller = sellers[_tokenAddress];
    seller.uniquePrices[_tokenId] = _price;
    
    return true;
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

    // transfer ether to receiver's address
    gift.sender.transfer(gift.claimEth);

    // send nft to buyer
    NFT nft = NFT(gift.tokenAddress);
    nft.transferFrom(address(this), msg.sender, gift.tokenId);

    // log cancel event
    emit LogCancel(_transitAddress, msg.sender, gift.tokenAddress, gift.tokenId);

    return true;
  }

  
  /**
   * @dev Claim gift to receiver's address if it is correctly signed
   * with private key for verification public key assigned to gift.
   * 
   * @param _receiver address Signed address.
   * @return True if success.
   */
  function claimGift(address _receiver) public whenNotPaused returns (bool success) {

    address _transitAddress = msg.sender;
    
    Gift storage gift = gifts[_transitAddress];

    // is deposited and wasn't claimed or cancelled before
    require(gift.status == Statuses.Deposited);

    /* // update gift status */
    gift.status = Statuses.Claimed;
    
    /* // send nft */
    NFT nft = NFT(gift.tokenAddress);
    nft.transferFrom(address(this), _receiver, gift.tokenId);
    
    /* // transfer ether to receiver's address */
    if (gift.claimEth > 0) {
      _receiver.transfer(gift.claimEth);
    }

    // log withdraw event
    emit LogClaim(_transitAddress, gift.sender, gift.tokenAddress, gift.tokenId, _receiver, gift.claimEth);
    
    return true;
  }

  // fallback function - do not receive ether by default
  function() public payable {
    revert();
  }
}
