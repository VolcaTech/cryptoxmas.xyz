require('dotenv').config();

import { Wallet, providers, utils, ContractFactory, Contract } from 'ethers';
import config from './config';
import CryptoxmasEscrow from '../build/CryptoxmasEscrow';
import NFT from '../build/NFT';
import { deployContract, storeData, waitForTransactionReceipt } from './helpers';

const mint = async () => {
    
    console.log("Minting tokens ", config.NETWORK);
    const provider = new providers.JsonRpcProvider(config.JSON_RPC_URL);
    const deployerPK = process.env.DEPLOYER_PK;
    const deployerWallet = new Wallet(deployerPK, provider);
    const deployerAddress = deployerWallet.address;    
    console.log("Minting from: ", deployerAddress);
    console.log(" ");    
    // deploy NFT token
    
    // console.log("Step: 1/6");
    // console.log("deploying NFT...");
    // const { contract: nft } = await deployContract(deployerWallet, NFT, ["Xmas Test NFT", "XMS-TST"]);
    // console.log("NFT deployed to: ", nft.address);
    // console.log("-------");
    // console.log(" ");

    
    // console.log("Step: 2/6");    
    // console.log("minting tokens...");
    // const imageUrl = "https://ipfs.infura.io/ipfs/QmbLR9VpdRKL6nb13BFJmDXYBjCdMvGyoP69VRdJoEZgP8";    
    // const tx2 = await nft.mintBatch(deployerWallet.address, 1, 10, imageUrl);    
    // await waitForTransactionReceipt(provider, tx2.hash);
    // console.log("tokens minted");
    // console.log("-------");    
    // console.log(" ");

    const nft = new Contract("0x2615D9dC77F13109BF10da63D9935a55A4Ad0f53", NFT.interface, deployerWallet);    

    console.log("Step: 2/6");    
    console.log("minting tokens...");
    const imageUrl2 = "https://ipfs.infura.io/ipfs/QmZPiwDLeDaaPp5jatbDUAftxnNGrdEDomhDSLmk2ztB23";    
    const tx22 = await nft.mintBatch(deployerWallet.address, 31, 40, imageUrl2);    
    await waitForTransactionReceipt(provider, tx22.hash);
    console.log("tokens minted");
    console.log("-------");    
    console.log(" ");

    console.log("Step: 2/6");    
    console.log("minting tokens...");
    const imageUrl23 = "https://ipfs.infura.io/ipfs/QmeW9VoBpLUh2fHV4k6Dm8sgf5RTgmht1VGBGMLYb2GFbu";    
    const tx23 = await nft.mintBatch(deployerWallet.address, 41, 50, imageUrl23);    
    await waitForTransactionReceipt(provider, tx23.hash);
    console.log("tokens minted");
    console.log("-------");    
    console.log(" ");
    
    
    // console.log("Step: 3/6");        
    // console.log("deploying escrow contract...");
    // const { contract: escrow } = await deployContract(deployerWallet, CryptoxmasEscrow, [config.GIVETH_BRIDGE_ADDRESS, config.GIVETH_CAMPAIGN_ID]);
    // console.log("escrow contract deployed to: ", escrow.address);
    // console.log("-------");    

    
    // // add Seller for this token
    // console.log("Step: 4/6");            
    // console.log("Adding deployer as a seller for the escrow...");    
    // const tx4 = await escrow.addSeller(deployerWallet.address, nft.address, utils.parseEther('0.05'));
    // await waitForTransactionReceipt(provider, tx4.hash);    
    // console.log("Deployer added as a seller for the escrow.");    
    // console.log("-------");
    // console.log(" ");

    
    // console.log("Step: 5/6");            
    // console.log("Setting approval for escrow contract for the NFT...");    
    // const tx5 = await nft.setApprovalForAll(escrow.address, true);
    // await waitForTransactionReceipt(provider, tx5.hash);    
    // console.log("Approval is set for the escrow..");        
    // console.log("-------");
    // console.log(" ");

    
    // console.log("Step: 6/6");            
    // console.log("setting unique price...");
    // const tx6 = await escrow.setUniquePrice(nft.address, 5, utils.parseEther('1'));
    // await waitForTransactionReceipt(provider, tx6.hash);
    // console.log("unique price is set for token #5");
    // console.log("-------");    
    // console.log(" ");
    
    // const deployedConfig = {};
    
    // deployedConfig.ESCROW_CONTRACT = escrow.address;
    // deployedConfig.NFT_ADDRESS = nft.address;
    // deployedConfig.SELLER_ADDRESS = deployerAddress;
    // deployedConfig.JSON_RPC_URL = config.JSON_RPC_URL;

    // const dappConfig = {};
    // dappConfig[config.NETWORK] = deployedConfig;
    
    // console.log(dappConfig);
    
    // storeData(dappConfig, './scripts/contract-config.json' );
    // console.log("Config is saved to './scripts/contract-config'.\n Copy and paste it to '../dapp-config.json' to update the front-end config");
    
}

const main = async () => {
    try {
	await mint();
    } catch(err) {
	console.log("ERROR while deploying contracts");
	console.log(err);
    }
};

main();
