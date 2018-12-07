import {utils} from 'ethers';
import CryptoxmasEscrow from './../build/cryptoxmasEscrow';

export const buyNFT = async ({value, transitAddress, nftAddress, escrowAddress, buyerWallet, tokenId}) => {
    const gasPrice = utils.parseEther('0.00011');
    const gasLimit = 400000;
    const args = [nftAddress, tokenId, transitAddress];
    const executeData = new utils.Interface(CryptoxmasEscrow.interface).functions.buyGift.encode(args);
    const transaction = {
	value,
	to: escrowAddress,
	data: executeData,
	gasPrice,
	gasLimit
    };

    const tx = await buyerWallet.sendTransaction(transaction);
    const receipt = await buyerWallet.provider.getTransactionReceipt(tx.hash);
    return { tx, receipt }; 
}

export const cancelGift = async ({ transitAddress, escrow, wallet }) => {
    const data = new utils.Interface(CryptoxmasEscrow.interface).functions.cancelGift.encode([transitAddress]);
    const tx = await wallet.sendTransaction({
	to: escrow.address,
	value: 0,
	data
    });

    const receipt = await wallet.provider.getTransactionReceipt(tx.hash);
    return { tx, receipt }; 
}


export const claimGift = async ({ transitAddress, transitWallet, receiverAddress, escrow, relayerWallet }) => {
    const gasPrice = utils.parseUnits('9', 'gwei');
    const gasLimit = 400000;

    const messageHash = utils.solidityKeccak256(
	['address', 'address'],
	[ receiverAddress, transitAddress]
    );
    
    const signature = await transitWallet.signMessage(utils.arrayify(messageHash));
    const args = [transitAddress, receiverAddress, signature];
    const data = new utils.Interface(CryptoxmasEscrow.interface).functions.claimGift.encode(args);
    const tx = await relayerWallet.sendTransaction({
	to: escrow.address,
	value: 0,
	data,
	gasPrice,
	gasLimit
    });

    const receipt = await relayerWallet.provider.getTransactionReceipt(tx.hash);
    return { tx, receipt }; 
}
