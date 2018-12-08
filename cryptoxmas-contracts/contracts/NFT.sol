pragma solidity ^0.4.25;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Enumerable.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';


contract NFT is ERC721Metadata,
  ERC721Enumerable,
  Ownable {
  
  constructor(string name, string symbol) public ERC721Metadata(name, symbol){
  }
    
  function mintWithTokenURI(
		uint256 _id,			    
		string _uri
		) onlyOwner public {
    super._mint(owner(), _id);
    super._setTokenURI(_id, _uri);
  }
  
}

