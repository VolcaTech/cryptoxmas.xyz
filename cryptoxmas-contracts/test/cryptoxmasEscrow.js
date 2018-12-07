import chai from 'chai';
import { createMockProvider, deployContract, getWallets, solidity } from 'ethereum-waffle';
import { utils, Wallet } from 'ethers';
import BasicNFT from './../build/NFT';
import CryptoxmasEscrow from './../build/cryptoxmasEscrow';
import GivethBridge from './../build/GivethBridge';
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
    let minNftPrice;
    let withEthAmount;
    let givethBridgeMock;
    let transitWallet2;
    let sellerNftPrice;
    let transitFee;
    
    beforeEach(async () => {
	provider = createMockProvider();
	[deployerWallet, sellerWallet, buyerWallet] = await getWallets(provider);

	transitWallet = Wallet.createRandom();
	transitWallet2 = Wallet.createRandom(); 
	
	// deploy NFT token
	nft = await deployContract(sellerWallet, BasicNFT, ["NFT Name", "NFT"]);
	await nft.mint(sellerWallet.address, 1);
	await nft.mint(sellerWallet.address, 2);
	
	// deploy mock of Giveth Bridge
	givethBridgeMock = await deployContract(deployerWallet, GivethBridge, []);
	
	
	// deploy escrow contract
	minNftPrice = utils.parseEther('0.01');
	
	sellerNftPrice = utils.parseEther('0.1'); 	
	withEthAmount = utils.parseEther('1.1');
	transitFee = utils.parseEther('0.01');
	
	escrow = await deployContract(deployerWallet, CryptoxmasEscrow, [givethBridgeMock.address, 1]);
	
	
	// add Seller for this token
	await escrow.addSeller(sellerWallet.address, nft.address, sellerNftPrice);
	await nft.setApprovalForAll(escrow.address, true);
	
    });

    xdescribe("Adding seller", () =>  {
	it('can add seller', async () => {
	    const sellerAddress = transitWallet.address;
	    const tokenAddress = transitWallet2.address;
	    
	    await escrow.addSeller(sellerAddress, tokenAddress, sellerNftPrice);
	    const seller = await escrow.getSeller(tokenAddress);
	    expect(seller.sellerAddress).to.be.eq(sellerAddress);
	    expect(seller.nftPrice).to.be.eq(sellerNftPrice);
	});

	it("can't override existing seller", async () => {
	    await expect(escrow.addSeller(sellerWallet.address, nft.address, sellerNftPrice)).to.be.reverted;
	});

	it("can't add seller with price less than minNftPrice", async () => {
	    const sellerAddress = transitWallet.address;
	    const tokenAddress = transitWallet2.address;	    
	    await expect(escrow.addSeller(sellerAddress, tokenAddress, utils.parseEther('0.0001'))).to.be.reverted;
	});
	
    });
    
    xdescribe("Buying NFT", () =>  { 
	describe("without ETH for receiver", () => {
	    beforeEach(async () => {
		await buyNFT({
		    value: sellerNftPrice,
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
		expect(gift.claimEth).to.eq(0);
		expect(gift.tokenAddress).to.eq(nft.address);
		expect(gift.tokenId).to.eq(1);
		expect(gift.status).to.eq(1); // not claimed
		expect(gift.nftPrice).to.eq(utils.parseEther('0.1')); 
	    });

	    it('does not transfer eth from buyer to escrow', async () => {
		const escrowBal = await deployerWallet.provider.getBalance(escrow.address);		
		expect(escrowBal).to.eq(0);
	    });

	    it('donates to charity', async () => {
		const givethBal = await deployerWallet.provider.getBalance(givethBridgeMock.address);
		expect(givethBal).to.eq(utils.parseEther('0.09'));
	    });

	    it('sends transit fee', async () => {
		const transitBal = await deployerWallet.provider.getBalance(transitWallet.address);
		expect(transitBal).to.eq(utils.parseEther('0.01'));
	    });
	    
	    
	    it("doesn't allow to override gift", async () => {
		await expect(buyNFT({
		    value: sellerNftPrice,
		    tokenId: 2, 
		    transitAddress: transitWallet.address,
		    nftAddress: nft.address,
		    escrowAddress: escrow.address,
		    buyerWallet
		})).to.be.reverted;
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
		expect(gift.claimEth).to.eq(utils.parseEther('1'));
		expect(gift.tokenAddress).to.eq(nft.address);
		expect(gift.tokenId).to.eq(1);
		expect(gift.status).to.eq(1); // not claimed
		expect(gift.nftPrice).to.eq(utils.parseEther('0.1'));
	    });

	    it('transfers eth from buyer to escrow', async () => {
		const escrowBal = await deployerWallet.provider.getBalance(escrow.address);		
		expect(escrowBal).to.eq(utils.parseEther('1'));
	    });

	    it('donates to charity', async () => {
		const givethBal = await deployerWallet.provider.getBalance(givethBridgeMock.address);
		expect(givethBal).to.eq(utils.parseEther('0.09'));
	    });

	    it('sends transit fee', async () => {
		const transitBal = await deployerWallet.provider.getBalance(transitWallet.address);
		expect(transitBal).to.eq(utils.parseEther('0.01'));
	    });

	});
	
	describe("when seller doesn't have NFT", () => {
	    it("it reverts", async () => {		
		await expect(buyNFT({
		    value: sellerNftPrice,
		    tokenId: 3, 		    
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

    describe("Cancelling gift", () =>  {

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
	    
	    it("it transfers NFT to buyer", async () => {
		expect(await nft.ownerOf(1)).to.eq(buyerWallet.address);
	    });
	    
	    it("it sends eth back to buyer", async () => {
		const escrowBal = await deployerWallet.provider.getBalance(escrow.address);
		const buyerBal = await deployerWallet.provider.getBalance(buyerWallet.address);
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
	
	describe("not existing gift", () => { 
	    it("can't cancel ", async () => {
		await expect(cancelGift({
		    transitAddress: deployerWallet.address,
		    escrow,
		    wallet: buyerWallet
		})).to.be.reverted;		
	    });
	});
	
	xdescribe("claimed gift", () => { 
	    it("can't cancel ", async () => {
		await claimGift({
		    transitAddress: transitWallet.address,
		    transitWallet,
		    receiverAddress: transitWallet.address,
		    relayerWallet: deployerWallet,
		    escrow
		});	  
		
		await expect(cancelGift({
		    transitAddress: deployerWallet.address,
		    escrow,
		    wallet: buyerWallet
		})).to.be.reverted;		
	    });
	});
    });
    
    xdescribe("Claiming gift", () =>  {
	let receiverAddress;
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
	
	describe("deposited gift", () => {
	    describe("with correct signature ", () => {
		let relayerBalBefore;
		
		beforeEach(async () => {
		    relayerBalBefore = await deployerWallet.provider.getBalance(deployerWallet.address);
		    await claimGift({
			transitAddress: transitWallet.address,
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
		
		it("(NFT price - gas costs) goes to Giveth campaign", async () => {
		    const givethBal = await deployerWallet.provider.getBalance(givethBridgeMock.address);
		    expect(givethBal).to.be.above(utils.parseEther('0.04'));		    
		});

		it("relayer is refunded for gas costs", async () => {
		    const relayerBal = await deployerWallet.provider.getBalance(deployerWallet.address);
		    const diff = relayerBalBefore.sub(relayerBal);
		    const diffFormatted = utils.formatEther(diff);
		    expect(Math.abs(Number(diffFormatted))).to.be.below(0.001);
		});

		
		it("can't claim the same gift twice", async () => {
		    await expect(claimGift({
			transitAddress: transitWallet.address,
			transitWallet,
			receiverAddress,
			relayerWallet: deployerWallet,
			escrow
		    })).to.be.reverted;
		});	    
		
	    });

	    describe("without extra Ether", () => {
		let relayerBalBefore;
		
		beforeEach(async () => {
		    await buyNFT({
			value: sellerNftPrice,
			tokenId: 2, 
			transitAddress: transitWallet2.address,
			nftAddress: nft.address,
			escrowAddress: escrow.address,
			buyerWallet
		    });	  		    
		    relayerBalBefore = await deployerWallet.provider.getBalance(deployerWallet.address);
		    await claimGift({
			transitAddress: transitWallet2.address,
			transitWallet: transitWallet2,
			receiverAddress,
			relayerWallet: deployerWallet,
			escrow
		    });	  
		});
		
		it("eth doesn't to receiver", async () => {
		    const gift = await escrow.getGift(transitWallet2.address);
		    const receiverBal = await deployerWallet.provider.getBalance(receiverAddress);
		    expect(receiverBal).to.eq(0);
		});

	    });
	    
	    describe("with incorrect signature ", () => { 
		it("transaction reverts", async () => {
		    await expect(claimGift({
			transitAddress: transitWallet.address,
			transitWallet: buyerWallet,
			receiverAddress,
			relayerWallet: deployerWallet,
			escrow
		    })).to.be.reverted;
		});
	    });
	});

	describe("cancelled gift", () => {

	    beforeEach(async () => {
		await claimGift({
		    transitAddress: transitWallet.address,
		    transitWallet,
		    receiverAddress,
		    relayerWallet: deployerWallet,
		    escrow
		});	  
	    });
	    
	    it("can't claim cancelled gift", async () => {
		await expect(claimGift({
		    transitAddress: transitWallet.address,
		    transitWallet: transitWallet,
		    receiverAddress,
		    relayerWallet: deployerWallet,
		    escrow
		})).to.be.reverted;		
	    });	    
	});
	describe("not existing gift", () => {
	    it("it reverts", async () => {
		await expect(claimGift({
		    transitAddress: buyerWallet.address,
		    transitWallet: buyerWallet,
		    receiverAddress,
		    relayerWallet: deployerWallet,
		    escrow
		})).to.be.reverted;		
	    });	    
	});		
    });
});

