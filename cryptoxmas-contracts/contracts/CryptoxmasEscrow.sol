pragma solidity ^0.4.25;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import './NFT.sol';


contract CryptoxmasEscrow is Pausable, Ownable {
  using SafeMath for uint256;
  
  /* Giveth */
  address public givethBridge;
  uint64 public givethReceiverId;

  /* NFT */
  NFT public nft; 
  
  // commission to fund paying gas for claim transactions
  uint public EPHEMERAL_ADDRESS_FEE = 0.01 ether;
  uint public MIN_PRICE = 0.05 ether; // minimum token price
  uint public tokensCounter; // minted tokens counter
  
  /* GIFT */
  enum Statuses { Empty, Deposited, Claimed, Cancelled }  
  
  struct Gift {
    address sender;
    uint claimEth; // ETH for receiver    
    uint256 tokenId;
    Statuses status;
    string msgHash; // IFPS message hash
  }

  // Mappings of transitAddress => Gift Struct
  mapping (address => Gift) gifts;


  /* Token Categories */
  enum CategoryId { Common, Special, Rare, Scarce, Limited, Epic, Unique }  
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

  event LogAddTokenCategory(
			    string tokenUri,
			    CategoryId categoryId,
			    uint maxQnty,
			    uint price
		  );
  

  /**
   * @dev Contructor that sets msg.sender as owner in Ownable,
   * sets escrow contract params and deploys new NFT contract 
   * for minting and selling tokens.
   *
   * @param _givethBridge address Address of GivethBridge contract
   * @param _givethReceiverId uint64 Campaign Id created on Giveth platform.
   * @param _name string Name for the NFT 
   * @param _symbol string Symbol for the NFT 
   */
  constructor(address _givethBridge,
	      uint64 _givethReceiverId,
	      string _name,
	      string _symbol) public {
    // setup Giveth params
    givethBridge = _givethBridge;
    givethReceiverId = _givethReceiverId;
    
    // deploy nft contract
    nft = new NFT(_name, _symbol);
  }

   /* 
   * METHODS 
   */
  
  /**
   * @dev Get Token Category for the tokenUri.
   *
   * @param _tokenUri string token URI of the category
   * @return Token Category details (CategoryId, minted, maxQnty, price)
   */  
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

  /**
   * @dev Add Token Category for the tokenUri.
   *
   * @param _tokenUri string token URI of the category
   * @param _categoryId uint categoryid of the category
   * @param _maxQnty uint maximum quantity of tokens allowed to be minted
   * @param _price uint price tokens of that category will be sold at  
   * @return True if success.
   */    
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

    emit LogAddTokenCategory(_tokenUri, _categoryId, _maxQnty, _price);
    return true;
  }

  /**
   * @dev Checks that it's possible to buy gift and mint token with the tokenURI.
   *
   * @param _tokenUri string token URI of the category
   * @param _transitAddress address transit address assigned to gift
   * @param _value uint amount of ether, that is send in tx. 
   * @return True if success.
   */      
  function canBuyGift(string _tokenUri, address _transitAddress, uint _value) public view returns (bool) {
    // can not override existing gift
    require(gifts[_transitAddress].status == Statuses.Empty);

    // eth covers NFT price
    TokenCategory memory category = tokenCategories[_tokenUri];
    require(_value >= category.price);

    // tokens of that type not sold out yet
    require(category.minted < category.maxQnty);
    
    return true;
  }

  /**
   * @dev Buy gift and mint token with _tokenUri, new minted token will be kept in escrow
   * until receiver claims it. 
   *
   * Received ether, splitted in 3 parts:
   *   - 0.01 ETH goes to ephemeral account, so it can pay gas fee for claim transaction. 
   *   - token price (minus ephemeral account fee) goes to the Giveth Campaign as a donation.  
   *   - Eth above token price is kept in the escrow, waiting for receiver to claim. 
   *
   * @param _tokenUri string token URI of the category
   * @param _transitAddress address transit address assigned to gift
   * @param _msgHash string IPFS hash, where gift message stored at 
   * @return True if success.
   */    
  function buyGift(string _tokenUri, address _transitAddress, string _msgHash)
          payable public whenNotPaused returns (bool) {
    
    require(canBuyGift(_tokenUri, _transitAddress, msg.value));

    // get token price from the category for that token URI
    uint tokenPrice = tokenCategories[_tokenUri].price;

    // ether above token price is for receiver to claim
    uint claimEth = msg.value.sub(tokenPrice);

    // mint new token 
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


    // transfer small fee to ephemeral account to fund claim txs
    _transitAddress.transfer(EPHEMERAL_ADDRESS_FEE);

    // send donation to Giveth campaign
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

  /**
   * @dev Send donation to Giveth campaign 
   * by calling function 'donateAndCreateGiver' of GivethBridge contract.
   *
   * @param _giver address giver address
   * @param _value uint donation amount (in wei)
   * @return True if success.
   */    
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

  /**
   * @dev Get Gift assigned to transit address.
   *
   * @param _transitAddress address transit address assigned to gift
   * @return Gift details
   */    
  function getGift(address _transitAddress) public view returns (
	     uint256 tokenId,
	     string tokenUri,								 
	     address sender,  // gift buyer
	     uint claimEth,   // eth for receiver
	     uint nftPrice,   // token price 	     
	     Statuses status, // gift status (deposited, claimed, cancelled) 								 	     
	     string msgHash   // IPFS hash, where gift message stored at 
    ) {
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
   * 
   * @param _transitAddress transit address assigned to gift
   * @return True if success.
   */
  function cancelGift(address _transitAddress) public returns (bool success) {
    Gift storage gift = gifts[_transitAddress];

    // is deposited and wasn't claimed or cancelled before
    require(gift.status == Statuses.Deposited);
    
    // only sender can cancel transfer;
    require(msg.sender == gift.sender);
    
    // update status to cancelled
    gift.status = Statuses.Cancelled;

    // transfer optional ether to receiver's address
    if (gift.claimEth > 0) {
      gift.sender.transfer(gift.claimEth);
    }

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
    // only holder of ephemeral private key can claim gift
    address _transitAddress = msg.sender;
    
    Gift storage gift = gifts[_transitAddress];

    // is deposited and wasn't claimed or cancelled before
    require(gift.status == Statuses.Deposited);

    // update gift status to claimed
    gift.status = Statuses.Claimed;
    
    // send nft to receiver
    nft.transferFrom(address(this), _receiver, gift.tokenId);
    
    // transfer ether to receiver's address
    if (gift.claimEth > 0) {
      _receiver.transfer(gift.claimEth);
    }

    // log claim event
    emit LogClaim(_transitAddress, gift.sender, gift.tokenId, _receiver, gift.claimEth);
    
    return true;
  }

  // fallback function - do not receive ether by default
  function() public payable {
    revert();
  }
}
