import {utils} from 'ethers';
import CryptoxmasEscrow from './../build/cryptoxmasEscrow';

export const buyNFT = async ({value, transitAddress, nftAddress, escrowAddress, buyerWallet, tokenId}) => {
    const gasPrice = utils.parseEther('0.00011');
    const gasLimit = 400000;
    const args = [nftAddress, tokenId, transitAddress];
    const executeData = new utils.Interface(CryptoxmasEscrow.interface).functions.buyGiftLink.encode(args);
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
