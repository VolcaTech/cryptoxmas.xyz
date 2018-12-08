# Crypto Xmas Contracts

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

### Deploying new Escrow contract guide and NFT tokens

- Edit `./scripts/config.js` to include network params you need (currently configured for Ropsten).  
- Add private key which has some ETH of chosen network to `cryptoxmas-contracts/.env` file:  
```
DEPLOYMENT_PK=0x000
```
- To deploy NFT contracts, Escrow contracts, run:  
```
yarn deploy
```
This will deploy Escrow Contract, NFT contract with some tokens ready for sale.
The script will also generate configs for front-end in `cryptoxmas-contracts/scripts/contract-config.json`.
Copy this file to `../dapp-config.json` and you'll be able to run you local website with these contract.

## License
GPL-3 Liscense 
