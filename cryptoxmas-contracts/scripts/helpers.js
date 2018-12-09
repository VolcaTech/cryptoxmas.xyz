import { ContractFactory, Contract } from 'ethers';
import fs from 'fs';

const defaultDeployOptions = {
    gasLimit: 4000000,
    gasPrice: 9000000000
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitForTransactionReceipt = async (providerOrWallet, transactionHash, tick = 10000) => {
    console.log("Waiting for receipt: ", transactionHash);
    const provider = providerOrWallet.provider ? providerOrWallet.provider : providerOrWallet;
    let receipt = await provider.getTransactionReceipt(transactionHash);
    while (!receipt) {
	sleep(tick);
	receipt = await provider.getTransactionReceipt(transactionHash);
    }
    console.log("Got receipt: ", transactionHash);    
    return receipt;
};

export const deployContract = async (wallet, contractJSON, args = [], overrideOptions = {}) => {
    const abi = contractJSON.interface;
    const bytecode = `0x${contractJSON.bytecode}`;
    const factory = new ContractFactory(abi, bytecode, wallet);
    const deployTransaction = {
	...defaultDeployOptions,
	...overrideOptions,
	...factory.getDeployTransaction(...args)
    };
    const tx = await wallet.sendTransaction(deployTransaction);
    const receipt = await waitForTransactionReceipt(wallet.provider, tx.hash);

    const contract = new Contract(receipt.contractAddress, abi, wallet);
    
    return { tx, receipt, contract };
}

export const storeData = (data, path) => {
    try {
	fs.writeFileSync(path, JSON.stringify(data));
	console.log("config file updated");
    } catch (err) {
	console.error(err);
    }
}
