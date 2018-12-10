require('dotenv').config();

import { Wallet, providers, utils, ContractFactory, Contract } from 'ethers';
import config from './config';
import CryptoxmasEscrow from '../build/CryptoxmasEscrow';
import NFT from '../build/NFT';
import { deployContract, storeData, waitForTransactionReceipt } from './helpers';

const deploy = async (network) => {
    
    console.log("Deploying contract for ", network);
    const networkConfig = config[network];
    const provider = new providers.JsonRpcProvider(networkConfig.JSON_RPC_URL);
    const deployerPK = process.env.DEPLOYER_PK;
    const deployerWallet = new Wallet(deployerPK, provider);
    const deployerAddress = deployerWallet.address;    
    console.log("deploying from: ", deployerAddress);
    console.log(" ");    

    console.log("Step: 3/6");        
    console.log("deploying escrow contract...");
    const escrowArgs = [networkConfig.GIVETH_BRIDGE_ADDRESS,
			networkConfig.GIVETH_CAMPAIGN_ID,
			networkConfig.NFT_NAME,
			networkConfig.NFT_SYMBOL];
    const { contract: escrow } = await deployContract(deployerWallet, CryptoxmasEscrow, escrowArgs);
    console.log("escrow contract deployed to: ", escrow.address);
    const nftAddress = await escrow.nft();
    console.log("NFT address is : ", nftAddress);
    console.log("-------");    
        
    const dappConfig = {};
    dappConfig[network] = {};
    
    dappConfig[network].ESCROW_CONTRACT = escrow.address;
    dappConfig[network].NFT_ADDRESS = nftAddress;
    dappConfig[network].JSON_RPC_URL = networkConfig.JSON_RPC_URL;

    console.log({dappConfig});
    
    storeData(dappConfig, `./scripts/deployed/dapp-config-${network}.json` );
    console.log(`Config is saved to './scripts/deployed/dapp-config-${network}.json'.`);
    console.log("To update the front-end config copy and paste it to '../dapp-config.json' (project root)");    
}

const main = async () => {
    try {
	await deploy("rinkeby");
    } catch(err) {
	console.log("ERROR while deploying contracts");
	console.log(err);
    }
};

main();
