# ✨ Crypto Xmas ✨


## Send Christmas Nifty tokens & Support Venezuelans

Send Christmas Nifty token, and a Ether Christmas Gift to your friends and family via a simple shareable link. Using the [Volca's "claim link" technology](https://volca.tech/), your friend only needs to click the link, and does not need to have an Ethereum wallet in advance.  

![Send](/public/cryptoxmas_repo_cover.png)

## Donations managed decentralized with Giveth

All proceeds, excluding gas cost for the Nifty token creation, is donated via the decentralized charity platform [Giveth](https://giveth.io/) to a transparent and traceable charity campaign distributing food to Venezuelans in need.  

## How it works

1) Head to cryptoxmas.xyz
2) Pick and buy a Nifty token you like
3) A fee is transferred to the Giveth Venezuela campaign
4) Share the link with the friend you want to surprise


## Not happy with your present? 

All Crypto Christmas Nifty token, with or without Ether, can be traded on [OpenSea](https://opensea.io/).

## Non-custodian escrow via eth2.io


### Sending flow

![Send](/public/buy_flow_server-less.png)

- 1. The sender buys Christmas Card (NFT) by sending ETH an escrow Smart Contract. (Optionally sender can add more ETH for receiver)
- 2. Escrow Smart Contract transfers NFT from seller's to the escrow
- 3. Smart contract sends small amount (0.01 eth) to ephemeral account, rest of NFT price to Giveth campaign as a donation and leaves ETH above the NFT price for receiver to claim in escrow. 
- 4. Sender shares claim link, which contains private key for ephemeral account, with receiver


### Receiving flow

- The receiver claims Christmas Nifty token and optional Ether. The escrow Smart Contract transfers the Christmas Nifty token from the website's address to the receiver’s address

![Receive](/public/claim_flow_server-less.png)

### Video demo 
* [Receiving demo](https://twitter.com/dobrokhvalov/status/1071440314169208834)

## Deploy locally

To deploy web app locally clone this repo and run: 
```
npm i && npm run start
```
This will install libs and open web app at localhost:3000.  
By default web app is configured to work with our smart-contracts currently deployed on Ropsten.  
  
If you want to play with smart-contracts - [see here](https://github.com/VolcaTech/cryptoxmas.xyz/blob/master/cryptoxmas-contracts).  
If you want to configure web app to use your smart-contracts, please update `dapp-config.json` accordingly.

## Join us

Pick an issue or join us in https://t.me/CryptoXmas ✨

