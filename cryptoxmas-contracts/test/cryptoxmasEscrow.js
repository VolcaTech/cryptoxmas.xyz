import chai from 'chai';
import { createMockProvider, deployContract, getWallets, solidity } from 'ethereum-waffle';
import { utils, Wallet } from 'ethers';
import BasicNFT from './../build/NFT';
import CryptoxmasEscrow from './../build/cryptoxmasEscrow';
import { buyNFT, cancelGift, claimGift } from './helpers';

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
    let nftPrice;
    let withEthAmount;

    
    beforeEach(async () => {
	provider = createMockProvider();
	[deployerWallet, sellerWallet, buyerWallet, transitWallet] = await getWallets(provider);

	// deploy NFT token
	nft = await deployContract(sellerWallet, BasicNFT, ["NFT Name", "NFT"]);
	await nft.mint(sellerWallet.address, 1);

	// deploy escrow contract
	nftPrice = utils.parseEther('0.05');
	withEthAmount = utils.parseEther('0.1');
	escrow = await deployContract(deployerWallet, CryptoxmasEscrow, [nftPrice]);

	
	// add Seller for this token
	await escrow.addSeller(sellerWallet.address, nft.address);
	await nft.setApprovalForAll(escrow.address, true);
	
    });

    xdescribe("Buying NFT", () =>  { 
	describe("without ETH for receiver", () => {
	    beforeEach(async () => {
		await buyNFT({
		    value: nftPrice,
		    tokenId: 1, 
		    transitAddress: transitWallet.address,
		    nftAddress: nft.address,
		    escrowAddress: escrow.address,
		    buyerWallet
		});
	    });

	    it('transfers token from seller to escrow', async () => {
		expect(await nft.ownerOf(1)).to.be.eq(escrow.address);
	    });

	    it('it saves gift to escrow', async () => {
		const gift = await escrow.getGift(transitWallet.address);
		expect(gift.sender).to.eq(buyerWallet.address);
		expect(gift.amount).to.eq(0);
		expect(gift.tokenAddress).to.eq(nft.address);
		expect(gift.tokenId).to.eq(1);
		expect(gift.status).to.eq(1); // not claimed
	    });

	    it('transfers eth from buyer to escrow', async () => {
		const escrowBal = await deployerWallet.provider.getBalance(escrow.address);		
		expect(escrowBal).to.eq(nftPrice);
	    });
	});
	
	describe("with ETH for receiver", () => {
	    beforeEach(async () => {
		await buyNFT({
		    value: withEthAmount,
		    tokenId: 1, 		    
		    transitAddress: transitWallet.address,
		    nftAddress: nft.address,
		    escrowAddress: escrow.address,
		    buyerWallet
		});
	    });

	    it('transfers token from seller to escrow', async () => {
		expect(await nft.ownerOf(1)).to.be.eq(escrow.address);
	    });

	    it('it saves gift to escrow', async () => {
		const gift = await escrow.getGift(transitWallet.address);
		expect(gift.sender).to.eq(buyerWallet.address);
		expect(gift.amount).to.eq(nftPrice);
		expect(gift.tokenAddress).to.eq(nft.address);
		expect(gift.tokenId).to.eq(1);
		expect(gift.status).to.eq(1); // not claimed
	    });

	    it('transfers eth from buyer to escrow', async () => {
		const escrowBal = await deployerWallet.provider.getBalance(escrow.address);		
		expect(escrowBal).to.eq(withEthAmount);
	    });	    
	});
	
	describe("when seller doesn't have NFT", () => {
	    it("it reverts", async () => {		
		await expect(buyNFT({
		    value: nftPrice,
		    tokenId: 2, 		    
		    transitAddress: transitWallet.address,
		    nftAddress: nft.address,
		    escrowAddress: escrow.address,
		    buyerWallet
		})).to.be.reverted;
	    });
	});
	describe("with less ETH than NFT price", () => {		
	    it("it reverts", async () => {
		await expect(buyNFT({
		    value: utils.parseEther('0.04'),
		    tokenId: 2, 		    
		    transitAddress: transitWallet.address,
		    nftAddress: nft.address,
		    escrowAddress: escrow.address,
		    buyerWallet
		})).to.be.reverted;		
	    });
	});		

    });

    xdescribe("Cancelling", () =>  {

	beforeEach(async () => {
	    await buyNFT({
		value: withEthAmount,
		tokenId: 1, 
		transitAddress: transitWallet.address,
		nftAddress: nft.address,
		escrowAddress: escrow.address,
		buyerWallet
	    });	  
	});

	
	describe("existing gift", () => {
	    
	    describe("on first cancel", () => {
		let gift;
		let buyerBalBefore;
		
		beforeEach(async () => {
		    buyerBalBefore = await deployerWallet.provider.getBalance(escrow.address);
		    await cancelGift({
			transitAddress: transitWallet.address,
			escrow,
			wallet: buyerWallet
		    });
		    gift = await escrow.getGift(transitWallet.address);
		});
		
		it("it changes gift status", async () => {
		    expect(gift.status).to.eq(3); // cancelled
		});

		it("it sends NFT token back to seller", async () => {
		    expect(await nft.ownerOf(1)).to.eq(sellerWallet.address);
		});

		xit("it sends eth back to buyer", async () => {
		    const escrowBal = await deployerWallet.provider.getBalance(escrow.address);
		    const buyerBal = await deployerWallet.provider.getBalance(escrow.address);
		    expect(escrowBal).to.eq(0);
		    expect(buyerBal).to.be.above(buyerBalBefore);
		});
		
		it("can't cancel twice", async () => {
		    await expect(cancelGift({
			transitAddress: transitWallet.address,
			escrow,
			wallet: buyerWallet
		    })).to.be.reverted;
		});
	    });
	    	    
	    it("cannot cancel gift if not sender", async () => {
		await expect(cancelGift({
		    transitAddress: deployerWallet.address,
		    escrow,
		    wallet: buyerWallet
		})).to.be.reverted;
	    });
	});
	
	describe("not existing gift", () => { 
	    it("can't cancel ", async () => {
		await expect(cancelGift({
		    transitAddress: deployerWallet.address,
		    escrow,
		    wallet: buyerWallet
		})).to.be.reverted;		
	    });
	});
    });

    describe("Claiming", () =>  {
	let receiverAddress;
	describe("pending gift", () => {

	    beforeEach(async () => {
		receiverAddress = Wallet.createRandom().address;
		
		await buyNFT({
		    value: withEthAmount,
		    tokenId: 1, 
		    transitAddress: transitWallet.address,
		    nftAddress: nft.address,
		    escrowAddress: escrow.address,
		    buyerWallet
		});	  
	    });
	    

	    
	    describe("with correct signature ", () => {
		beforeEach(async () => {
		    await claimGift({
			transitWallet,
			receiverAddress,
			relayerWallet: deployerWallet,
			escrow
		    });	  
		});
		
		
		it("token goes to receiver", async () => {
		    expect(await nft.ownerOf(1)).to.be.eq(receiverAddress);
		});

		it("gift status updated to claimed", async () => {
		    const gift = await escrow.getGift(transitWallet.address);
		    expect(gift.status).to.eq(2); // claimed
		});		
		
		it("eth goes to receiver", async () => {
		    const gift = await escrow.getGift(transitWallet.address);
		    const receiverBal = await deployerWallet.provider.getBalance(receiverAddress);
		    expect(receiverBal).to.eq(gift.amount);
		});
		
		xit("(NFT price - gas costs) goes to Giveth campaign", async () => {		    
		});

		xit("relayer is refunded for gas costs", () => {
		});
	    });
	    
	    describe("with incorrect signature ", () => { 
		xit("transaction reverts", async () => {
		});
	    });
	});

	describe("claimed gift", () => {
	    xit("can't claim the same gift twice", async () => {
	    });	    
	});

	describe("cancelled gift", () => {
	    xit("can't claim cancelled gift", async () => {
	    });	    
	});
	describe("not existing gift", () => {
	    xit("it reverts", async () => {
	    });	    
	});		
    });
});
