# Crypto Xmas Contracs

Contracts for the cryptoxmas.xyz. Includes:  
- Escrow contract with buy and claim logic  
- NFT token (ERC721 Enumerable + Mintable)  


## Building contracts

Install libs:  
```
yarn
```

Waffle is used to build and test contracts - https://github.com/EthWorks/Waffle  
To build contracts run: 
```
yarn waffle 
```
To test:
```
yarn test
```

### Deploying new Escrow contract guide

- Deploy Escrow contract (`cryptoxmasEscrow.sol`) with standart price for NFT using Remix browser to the network of your choice.
- Add seller using 'addSeller' method of the escrow contract. Seller is the address that has NFTs for sale.
- As a seller of NFTs, approve escrow contract to distribute tokens on your behalf using `setApprovalForAll` method
- Update `./dapp-config.json` and `cryptoxmas-server/src/app-config.json` accordingly

## License
GPL-3 Liscense 
