require('dotenv').config();

import { Wallet, providers, utils, ContractFactory, Contract } from 'ethers';
import config from './config';
import CryptoxmasEscrow from '../build/CryptoxmasEscrow';
import NFT from '../build/NFT';
import axios from 'axios';
import { deployContract, storeData, waitForTransactionReceipt, readCSV } from './helpers';


const mint = async (network, escrowAddress) => {

    const networkConfig = config[network];
    console.log("Minting tokens ", network);
    const provider = new providers.JsonRpcProvider(networkConfig.JSON_RPC_URL);
    const deployerPK = process.env.DEPLOYER_PK;
    const deployerWallet = new Wallet(deployerPK, provider);
    console.log("Minting from: ", deployerWallet.address);
    console.log(" ");    

    const tokensDct = {};
    const escrow = new Contract(escrowAddress, CryptoxmasEscrow.interface, deployerWallet);
    
    const rows = await readCSV('./scripts/tokens.csv');
    for (let r of rows) {
	console.log({r})
	let [name, url, categoryId, maxQnty, price] = r;
	console.log("fetching ", url);

	const { data: metadata } = await axios.get(url);

	// save category to file
	const token = {
	    metadata,
	    tokenUri: url,
	    categoryId: Number(categoryId),
	    price: Number(price),
	    maxQnty: Number(maxQnty)
	};
	tokensDct[utils.id(url)] = token;


	// save category to escrow contract
	let category = await escrow.getTokenCategory(url);
	if (category.price.toString() === '0') {
	    console.log("Adding new category to blockchain ", url);
	    let result = await escrow.addTokenCategory(url, token.categoryId, token.maxQnty, utils.parseEther(String(token.price)));
	    await waitForTransactionReceipt(provider, result.hash);
	    console.log("category added");
	} else {
	    console.log("Existing category for: ", url);
	}
	
	console.log("----");
	console.log("");
    }

    const dct = {};
    dct[network] = tokensDct;
    
    storeData(dct, `./scripts/deployed/mintedTokens-${network}.json` );
    console.log(`Config is saved to './scripts/deployed/mintedTokens-${network}.json'.`);
}




const main = async () => {
    try {
	// await mint("ropsten", "0xb6623F9d7CF3b04A34C757aebf549500b65977e4");
	// await mint("rinkeby", "0xB06521bf4C170C7111538B10a13EdF1F0435D67A");
	await mint("mainnet", "0xcBD901dB55c9139828f7b5D5Cbfd5AfeAB01d066");	
    } catch(err) {
	console.log("ERROR while deploying contracts");
	console.log(err);
	throw Error(err);
    }
};

main();
