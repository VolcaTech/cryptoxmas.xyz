pragma solidity ^0.4.25;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import './NFT.sol';


contract CryptoxmasEscrow is Pausable, Ownable {
  using SafeMath for uint256;
  
  /* Giveth  */
  address public givethBridge;
  uint64 public givethReceiverId;

  /* NFT   */
  NFT public nft; 
  
  // commission to fund paying gas for claim transactions
  uint public EPHEMERAL_ADDRESS_FEE = 0.01 ether;
  uint public MIN_PRICE = 0.05 ether; // minimum token price
  uint public tokensCounter; // minted tokens counter
  
  /* GIFT */
  enum Statuses { Empty, Deposited, Claimed, Cancelled }  
  
  struct Gift {
    address sender;
    uint claimEth; // eth for receiver    
    uint256 tokenId;
    Statuses status;
    string msgHash; // ifps message hash
  }

  // Mappings of transitAddress => Transfer Struct
  mapping (address => Gift) gifts;


  /* Token Categories */
  enum CategoryId { Common, Special, Rare, Scarce, Limited, Epic }  
  struct TokenCategory {
    CategoryId categoryId;
    uint minted;  // already minted
    uint maxQnty; // maximum amount of tokens to mint
    uint price; 
  }

  // tokenURI => TokenCategory
  mapping(string => TokenCategory) tokenCategories;
  
  /*
   * EVENTS
   */
  event LogBuy(
	       address indexed transitAddress,
	       address indexed sender,
	       string indexed tokenUri,
	       uint tokenId,
	       uint claimEth,
	       uint nftPrice
	       );

  event LogClaim(
		 address indexed transitAddress,
		 address indexed sender,
		 uint tokenId,
		 address receiver,
		 uint claimEth
		 );  

  event LogCancel(
		  address indexed transitAddress,
		  address indexed sender,
		  uint tokenId
		  );
  
  
  constructor(address _givethBridge,
	      uint64 _givethReceiverId,
	      string _name,
	      string _symbol) public {
    givethBridge = _givethBridge;
    givethReceiverId = _givethReceiverId;

    nft = new NFT(_name, _symbol);
  }

  function getTokenCategory(string _tokenUri) public view returns (CategoryId categoryId,
								  uint minted,
								  uint maxQnty,
								  uint price) { 
    TokenCategory memory category = tokenCategories[_tokenUri];
    
    return (category.categoryId,
	    category.minted,
	    category.maxQnty,
	    category.price);
  }

  function addTokenCategory(string _tokenUri, CategoryId _categoryId, uint _maxQnty, uint _price)
    public onlyOwner returns (bool success) {

    // price should be more than MIN_PRICE
    require(_price >= MIN_PRICE);
	    
    // can't override existing category
    require(tokenCategories[_tokenUri].price == 0);
    
    tokenCategories[_tokenUri] = TokenCategory(_categoryId,
					       0, // zero tokens minted initially
					       _maxQnty,
					       _price);
    return true;
  }

  
  function canBuyGift(string _tokenUri, address _transitAddress, uint _value) public view returns (bool) {
    // can not override existing gift
    require(gifts[_transitAddress].status == Statuses.Empty);

    // eth covers NFT price
    TokenCategory memory category = tokenCategories[_tokenUri];
    require(_value >= category.price);

    // can not override existing gift
    require(gifts[_transitAddress].status == Statuses.Empty);

    // tokens of that type not sold out yet
    require(category.minted < category.maxQnty);
    
    return true;
  }


  function buyGift(string _tokenUri, address _transitAddress, string _msgHash)
          payable public whenNotPaused returns (bool) {
    
    require(canBuyGift(_tokenUri, _transitAddress, msg.value));

    uint tokenPrice = tokenCategories[_tokenUri].price;
    uint claimEth = msg.value.sub(tokenPrice);


    // mint nft 
    uint tokenId = tokensCounter.add(1);
    nft.mintWithTokenURI(tokenId, _tokenUri);

    // increment counters
    tokenCategories[_tokenUri].minted = tokenCategories[_tokenUri].minted.add(1);
    tokensCounter = tokensCounter.add(1);
    
    // saving gift details
    gifts[_transitAddress] = Gift(
				  msg.sender,
				  claimEth,
				  tokenId,
				  Statuses.Deposited,
				  _msgHash
				  );


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
		_tokenUri,
		tokenId,
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
	     uint256 tokenId,
	     string tokenUri,								 
	     address sender, // transfer sender
	     uint claimEth,
	     uint nftPrice,	     
	     Statuses status,								 	     
	     string msgHash) {
    Gift memory gift = gifts[_transitAddress];
    tokenUri =  nft.tokenURI(gift.tokenId);
    TokenCategory memory category = tokenCategories[tokenUri];
    
    return (
	    gift.tokenId,
	    tokenUri,
	    gift.sender,
	    gift.claimEth,
	    category.price,	    
	    gift.status,
	    gift.msgHash
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

    // transfer ether to receiver's address
    gift.sender.transfer(gift.claimEth);

    // send nft to buyer
    nft.transferFrom(address(this), msg.sender, gift.tokenId);

    // log cancel event
    emit LogCancel(_transitAddress, msg.sender, gift.tokenId);

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
    
    // send nft
    nft.transferFrom(address(this), _receiver, gift.tokenId);
    
    // transfer ether to receiver's address
    if (gift.claimEth > 0) {
      _receiver.transfer(gift.claimEth);
    }

    // log withdraw event
    emit LogClaim(_transitAddress, gift.sender, gift.tokenId, _receiver, gift.claimEth);
    
    return true;
  }

  // fallback function - do not receive ether by default
  function() public payable {
    revert();
  }
}
