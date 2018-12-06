import chai from 'chai';
import {createMockProvider, deployContract, getWallets, solidity} from 'ethereum-waffle';
import {utils} from 'ethers';
import BasicNFT from './../build/NFT';
import CryptoxmasEscrow from './../build/cryptoxmasEscrow';


chai.use(solidity);

const {expect} = chai;

describe('CryptoxmasEscrow', () => {
    let provider;
    let nft;
    let transitWallet;
    let escrow;
    let deployerWallet;
    let sellerWallet;
    let buyerWallet;
    let receiverWallet;
    let nftPrice;

    
    beforeEach(async () => {
	provider = createMockProvider();
	[deployerWallet, sellerWallet, buyerWallet, receiverWallet, transitWallet] = await getWallets(provider);

	// deploy NFT token
	nft = await deployContract(sellerWallet, BasicNFT, ["NFT Name", "NFT"]);
	await nft.mint(sellerWallet.address, 1);

	// deploy escrow contract
	nftPrice = utils.parseEther('0.05');
	escrow = await deployContract(deployerWallet, CryptoxmasEscrow, [nftPrice]);

	
	// add Seller for this token
	await escrow.addSeller(sellerWallet.address, nft.address);
	await nft.setApprovalForAll(escrow.address, true);
	
    });

    describe("Buying NFT", () =>  { 
	describe("without ETH for receiver", () => {
	    beforeEach(async () => {
		const gasPrice = utils.parseEther('0.00011');
		const gasLimit = 400000;
		const args = [nft.address, 1, transitWallet.address];
		const executeData = new utils.Interface(CryptoxmasEscrow.interface).functions.buyGiftLink.encode(args);
		const transaction = {
		    value: nftPrice,
		    to: escrow.address,
		    data: executeData,
		    gasPrice,
		    gasLimit
		};

		const tx = await buyerWallet.sendTransaction(transaction);
		const receipt = await buyerWallet.provider.getTransactionReceipt(tx.hash);		
	    });
	    
	    
	    xit('transfers token from seller to escrow', async () => {
		expect(await nft.ownerOf(1)).to.be.eq(escrow.address);
	    });

	    xit('it saves gift to escrow', async () => {
		const gift = await escrow.getGift(transitWallet.address);

		expect(gift.sender).to.eq(buyerWallet.address);
		expect(gift.amount).to.eq(0);
		expect(gift.tokenAddress).to.eq(nft.address);
		expect(gift.tokenId).to.eq(1);
		expect(gift.status).to.eq(1); // not claimed
	    });

	    xit('transfers eth from buyer to escrow', async () => {
		
	    });
	});
	
	xdescribe("with ETH for receiver", () => {
	    
	});
	
	xit("can't buy NFT if seller doesn't have NFT", async () => {
	});

	
	xit("can't pay less than NFT price", async () => {
	});
		

    });

    xdescribe("Cancelling gift"), () =>  {

	xit("can cancel gift", async () => {
	});

	xit("cannot cancel not gift if not sender", async () => {
	});
	
	
	xit("cannot cancel not existing gift", async () => {
	});
    };
    
});
