import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Enumerable.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';


contract NFT is ERC721Metadata,
  ERC721Enumerable,
  Ownable {
  
  constructor(string name, string symbol) public ERC721Metadata(name, symbol){
  }
  
  function mint(
		address _owner,
		uint256 _id
		) onlyOwner public {
    super._mint(_owner, _id);
  }

  function mintBatch(address _owner, uint _from, uint _to) onlyOwner {
    require(_to > _from);
    for (uint i = _from; i < _to; i++){
      mint(_owner, i);
    }
  }
  
  function burn(
		address _owner,
		uint256 _tokenId
		) onlyOwner external {
    super._burn(_owner, _tokenId);
  }
  
  
  function setTokenURI(uint256 tokenId, string uri) public {
    super._setTokenURI(tokenId, uri);
  }  
}

