import Promise from "bluebird";
import escrowContract from "./escrowContract";
import * as server from "./serverApi";
import { signReceiverAddress } from './utils';
import { sha3 } from 'web3-utils';
import getWeb3 from './../../utils/getWeb3';
const Wallet = require('ethereumjs-wallet');


const _generateTransferIdForLink = (address) => {
    return `link-${address}`;
}

export const buyGift = async ({tokenId, amountToPay, senderAddress}) => {
    const wallet = Wallet.generate();
    const transitAddress = wallet.getChecksumAddressString();
    const transitPrivateKey = wallet.getPrivateKeyString().substring(2);
    const transferId = _generateTransferIdForLink(transitAddress);
    
    // 3. send deposit to smart contract
    const txHash = await escrowContract.buyGift(tokenId, transitAddress, amountToPay);
    return { txHash, transitPrivateKey, transferId, transitAddress };
}


export const cancelTransfer = ((transitAddress, contractVersion) => escrowContract.cancel(transitAddress, contractVersion));
//export const getAmountWithCommission = ((amount) => escrowContract.getAmountWithCommission(amount));
//export const getWithdrawalEvents = ((address, fromBlock) => escrowContract.getWithdrawalEvents(address, fromBlock));


const _getAddressFromPrivateKey = (privateKey) => {
   return '0x' + Wallet.fromPrivateKey(
       new Buffer(privateKey, 'hex')).getAddress().toString('hex');
}


export const claimGift = async ({transitPrivateKey, receiverAddress}) => {
    console.log({transitPrivateKey})
    const transitAddress = _getAddressFromPrivateKey(transitPrivateKey);
    const transferId = _generateTransferIdForLink(transitAddress);
    
    const { v, r, s } = signReceiverAddress({
        address: receiverAddress,
        transitPrivateKey
    });
    
    const result = await server.confirmLinkTx(
        transitAddress,
        receiverAddress,
        v, r, s);
    
    
    if (!result.success) {
        throw new Error((result.errorMessage || "Server error on withdrawal!"));
    }
    
    
    return { txHash: result.txHash, amount: result.amount, transferId };
}


