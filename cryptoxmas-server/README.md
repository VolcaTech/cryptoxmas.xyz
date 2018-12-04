# Crypto Xmas Server

Server, relaying claim transactions for gift receivers at https://cryptoxmas.xyz  

## Deploying and testing

Install libs:  
```
npm i 
```

Please create config file `cryptoxmas-server/src/config/app-config.json` and add the following options:  

```
{
    "PORT": 3006,  // port number
    "ETHEREUM_NETWORK": "ropsten", // network 
    "ETHEREUM_ACCOUNT_PK": "0x000...", // private key of server account, which will make the transactions
    "ESCROW_CONTRACT_ADDRESS": "0xa1d89cb2dc2283325dde52defd2056e099916103" // escrow contract address
}		
```

Start server:  
```
npm run start
```

## License
GPL-3 Liscense 
