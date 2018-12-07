import ethers from 'ethers';
import {getWallets, deployContract} from 'ethereum-waffle';
import config from './config';
import CryptoxmasEscrow from '../build/CryptoxmasEscrow';
import NFT from '../build/NFT';
import fs from 'fs';


const storeData = (data, path) => {
    try {
	fs.writeFileSync(path, JSON.stringify(data));
	console.log("config file updated");
    } catch (err) {
	console.error(err);
    }
}

const main = async () => {
    // this.provider = new ethers.providers.JsonRpcProvider(config.jsonRpcUrl);
    // this.wallets = await getWallets(this.provider);
    // this.deployer = this.wallets[this.wallets.length - 1];
    console.log("deploying new contracts");
    const contractConfig = {};
    
    contractConfig.ESCROW_CONTRACT = '0x0';
    contractConfig.NFT_ADDRESS = '0x01';
    
    storeData(contractConfig, './scripts/contract-config.json' );
}

main();
