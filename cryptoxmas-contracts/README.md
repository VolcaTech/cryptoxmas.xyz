# Crypto Xmas Contracts

Contracts for the cryptoxmas.xyz. Includes:  
- Escrow contract with buy and claim logic  
- NFT token (ERC721 Enumerable + Mintable)  

## Non-custodian escrow  
### Sending flow  

![Send](/public/buy_flow_server-less.png)

1. Sender buys Christmas Card (NFT) by sending ETH to an escrow Smart Contract. (Optionally sender can add more ETH for receiver)
2. Escrow Smart Contract transfers NFT from seller to the escrow
3. Smart Contract sends small amount (0.01 eth) to ephemeral account, rest of NFT price to Giveth campaign as a donation and leaves ETH above the NFT price for receiver to claim in escrow.
4. Sender shares claim link, which contains private key for ephemeral account, with receiver


### Receiving flow

![Receive](/public/claim_flow_server-less.png)

1. Receiver submits claim transaction with the private key in the claim link.
2. The escrow Smart Contract transfers the Christmas Card (NFT) and optional ether to the receiver’s address


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
