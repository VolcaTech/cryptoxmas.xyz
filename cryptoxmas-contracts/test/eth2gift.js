import chai from 'chai';
import {createMockProvider, deployContract, getWallets, solidity} from 'ethereum-waffle';
import BasicNFT from './build/NFT';

chai.use(solidity);

const {expect} = chai;

describe('Example', () => {
    let provider;
    let nft;
    let wallet;
    let walletTo;

    beforeEach(async () => {
	provider = createMockProvider();
	[wallet, walletTo] = await getWallets(provider);
	nft = await deployContract(wallet, BasicNFT, [wallet.address, 1000]);
    });

    it('Assigns initial balance', async () => {
	//expect(await token.balanceOf(wallet.address)).to.eq(1000);
	const nft = await nft.ownerOf();
	console.log({nft});
    });

    // it('Transfer adds amount to destination account', async () => {
    // 	await token.transfer(walletTo.address, 7);
    // 	expect(await token.balanceOf(wallet.address)).to.eq(993);
    // 	expect(await token.balanceOf(walletTo.address)).to.eq(7);
    // });

    // it('Transfer emits event', async () => {
    // 	await expect(token.transfer(walletTo.address, 7))
    // 	    .to.emit(token, 'Transfer')
    // 	    .withArgs(wallet.address, walletTo.address, 7);
    // });

    // it('Can not transfer from empty account', async () => {
    // 	const tokenFromOtherWallet = contractWithWallet(token, walletTo);
    // 	await expect(tokenFromOtherWallet.transfer(wallet.address, 1))
    // 	    .to.be.revertedWith('Not enough balance on sender account');
    // });
});
