require('dotenv').config();

import { Wallet, providers, utils, ContractFactory, Contract } from 'ethers';
import config from './config';
import CryptoxmasEscrow from '../build/CryptoxmasEscrow';
import NFT from '../build/NFT';
import { deployContract, storeData, waitForTransactionReceipt } from './helpers';

const deploy = async () => {


    
    console.log("Deploying contracts for ", config.NETWORK);
    const provider = new providers.JsonRpcProvider(config.JSON_RPC_URL);
    const deployerPK = process.env.DEPLOYER_PK;
    const deployerWallet = new Wallet(deployerPK, provider);
    const deployerAddress = deployerWallet.address;    
    console.log("deploying from: ", deployerAddress);
    console.log(" ");    
    // deploy NFT token
    
    console.log("Step: 1/6");
    console.log("deploying NFT...");
    const { contract: nft } = await deployContract(deployerWallet, NFT, ["Xmas Test NFT", "XMS-TST"]);
    console.log("NFT deployed to: ", nft.address);
    console.log("-------");
    console.log(" ");

    
    console.log("Step: 2/6");    
    console.log("minting tokens...");
    const imageUrl = "https://ipfs.io/ipfs/Qme2tDivU5aF5d7XGuqwoFGxddfGiFsmposUcdXegAvEth";    
    const tx2 = await nft.mintBatch(deployerWallet.address, 1, 10, imageUrl);    
    await waitForTransactionReceipt(provider, tx2.hash);
    console.log("tokens minted");
    console.log("-------");    
    console.log(" ");

    
    console.log("Step: 3/6");        
    console.log("deploying escrow contract...");
    const { contract: escrow } = await deployContract(deployerWallet, CryptoxmasEscrow, [config.GIVETH_BRIDGE_ADDRESS, config.GIVETH_CAMPAIGN_ID]);
    console.log("escrow contract deployed to: ", escrow.address);
    console.log("-------");    

    
    // add Seller for this token
    console.log("Step: 4/6");            
    console.log("Adding deployer as a seller for the escrow...");    
    const tx4 = await escrow.addSeller(deployerWallet.address, nft.address, utils.parseEther('0.1'));
    await waitForTransactionReceipt(provider, tx4.hash);    
    console.log("Deployer added as a seller for the escrow.");    
    console.log("-------");
    console.log(" ");

    
    console.log("Step: 5/6");            
    console.log("Setting approval for escrow contract for the NFT...");    
    const tx5 = await nft.setApprovalForAll(escrow.address, true);
    await waitForTransactionReceipt(provider, tx5.hash);    
    console.log("Approval is set for the escrow..");        
    console.log("-------");
    console.log(" ");

    
    console.log("Step: 6/6");            
    console.log("setting unique price...");
    const tx6 = await escrow.setUniquePrice(nft.address, 5, utils.parseEther('1'));
    await waitForTransactionReceipt(provider, tx6.hash);
    console.log("unique price is set for token #5");
    console.log("-------");    
    console.log(" ");
    
    const deployedConfig = {};
    
    deployedConfig.ESCROW_CONTRACT = escrow.address;
    deployedConfig.NFT_ADDRESS = nft.address;
    deployedConfig.SELLER_ADDRESS = deployerAddress;

    const dappConfig = {};
    dappConfig[config.NETWORK] = deployedConfig;

    console.log(dappConfig);
    
    storeData(dappConfig, './scripts/contract-config.json' );
    console.log("Config is saved to './scripts/contract-config'.\n Copy and paste it to '../dapp-config.json' to update the front-end config");
    
}

const main = async () => {
    try {
	await deploy();
    } catch(err) {
	console.log("ERROR while deploying contracts");
	console.log(err);
    }
};

main();
