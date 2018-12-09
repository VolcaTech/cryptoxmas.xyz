import chai from 'chai';
import { createMockProvider, deployContract, getWallets, solidity } from 'ethereum-waffle';
import { utils, Wallet, Contract } from 'ethers';
import BasicNFT from './../build/NFT';
import CryptoxmasEscrow from './../build/CryptoxmasEscrow';
import GivethBridge from './../build/GivethBridge';
import { buyNFT, cancelGift, claimGift, genereteTransitWallet } from './helpers';

chai.use(solidity);

const {expect} = chai;


describe('CryptoxmasEscrow', () => {
    let provider;
    let nft;
    let transitWallet;
    let escrow;
    let deployerWallet;
    let buyerWallet;
    let minNftPrice;
    let withEthAmount;
    let givethBridgeMock;
    let transitWallet2;
    let transitFee;
    let fakeTransitWallet;
    let messageHash = 'Qme2tDivU5aF5d7XGuqwoFGxddfGiFsmposUcdXegAvEth';
    let tokenUri1 = "https://ipfs.infura.io/ipfs/QmbLR9VpdRKL6nb13BFJmDXYBjCdMvGyoP69VRdJoEZgP8";
    let tokenUri2 = "https://ipfs.infura.io/ipfs/QmZPiwDLeDaaPp5jatbDUAftxnNGrdEDomhDSLmk2ztB23";
    let tokenUri3 =  "https://ipfs.infura.io/ipfs/QmeW9VoBpLUh2fHV4k6Dm8sgf5RTgmht1VGBGMLYb2GFbu";
    let rareCategory;
    let uniqueCategory;
    
    beforeEach(async () => {
	provider = createMockProvider();
	[deployerWallet, buyerWallet, fakeTransitWallet] = await getWallets(provider);

	transitWallet = genereteTransitWallet(provider);
	transitWallet2 = genereteTransitWallet(provider);

	// deploy escrow contract	
	minNftPrice = utils.parseEther('0.05');	
	withEthAmount = utils.parseEther('1.1');
	transitFee = utils.parseEther('0.01');
	

	// smart contract args
	givethBridgeMock = await deployContract(deployerWallet, GivethBridge, []);
	const givethCampaignId = 1;
	const tokenName = "Test NFT";
	const tokenSymbol = "TST";
	
	const escrowArgs =  [givethBridgeMock.address, givethCampaignId, tokenName, tokenSymbol ];
		
	escrow = await deployContract(deployerWallet, CryptoxmasEscrow, escrowArgs);

	// nft contract created by the escrow contract 
	const nftAddress = await escrow.nft();
	nft = new Contract(nftAddress, BasicNFT.interface, provider);

	// add token categories
	rareCategory = {
	    tokenUri: tokenUri1,
	    categoryId: 0,
	    maxQnty: 10,
	    price: minNftPrice
	};

	uniqueCategory = {
	    tokenUri: tokenUri2,
	    categoryId: 1,
	    maxQnty: 1,
	    price: utils.parseEther('1')
	};

	// add token categories for sale
	await escrow.addTokenCategory(rareCategory.tokenUri, rareCategory.categoryId, rareCategory.maxQnty, rareCategory.price);
	await escrow.addTokenCategory(uniqueCategory.tokenUri, uniqueCategory.categoryId, uniqueCategory.maxQnty, uniqueCategory.price);
    });

    describe("Deploying escrow", () => {
	it("has correct claiming gas fee", async () => {
	    expect(await escrow.EPHEMERAL_ADDRESS_FEE()).to.be.eq(transitFee);
	});

	it("has correct claiming min token price", async () => {
	    expect(await escrow.MIN_PRICE()).to.be.eq(minNftPrice);
	});
	
	it("has correct initial tokens counter", async () => {
	    expect(await escrow.tokensCounter()).to.be.eq(0);
	});

	it("is inited with correct Giveth address", async () => {
	    expect(await escrow.givethBridge()).to.be.eq(givethBridgeMock.address);
	});

	it("is inited with correct Giveth campaign", async () => {
	    expect(await escrow.givethReceiverId()).to.be.eq(1);
	});	
	
	it("has created NFT with correct name", async () => {
	    expect(await nft.name()).to.be.eq("Test NFT");
	});

	it("has created NFT with correct symbol", async () => {
	    expect(await nft.symbol()).to.be.eq("TST");
	});

	it("escrow is the owner of NFT", async () => {
	    expect(await nft.owner()).to.be.eq(escrow.address);
	});	
    });

    describe("Token categories", () => {
	
	it("has added rare token category", async () => {
	    const cat = await escrow.getTokenCategory(rareCategory.tokenUri);
	    expect(cat.categoryId).to.be.eq(rareCategory.categoryId);
	    expect(cat.minted).to.be.eq(0);
	    expect(cat.maxQnty).to.be.eq(rareCategory.maxQnty);
	    expect(cat.price).to.be.eq(rareCategory.price);	    
	});

	it("has added unique token category", async () => {
	    const cat = await escrow.getTokenCategory(uniqueCategory.tokenUri);
	    expect(cat.categoryId).to.be.eq(uniqueCategory.categoryId);
	    expect(cat.minted).to.be.eq(0);
	    expect(cat.maxQnty).to.be.eq(uniqueCategory.maxQnty);
	    expect(cat.price).to.be.eq(uniqueCategory.price);	    
	});

	
	xit("can't add category with price less than MIN_PRICE", () => {
		
	});
	
	xit("can't override existing token category", () => {
		
	});
	
	xit("only owner can add token category", () => {
	    
	});
    });
    
    xdescribe("Buying NFT", () =>  {
	describe("without claim ETH", () => {
	    beforeEach(async () => {
		await buyNFT({
		    value: sellerNftPrice,
		    tokenId: 1, 
		    transitAddress: transitWallet.address,
		    nftAddress: nft.address,
		    escrowAddress: escrow.address,
		    buyerWallet,
		    messageHash
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
		expect(gift.msgHash).to.eq(messageHash); 		
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

	
	describe("with claim ETH", () => {
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

	describe("unique token with claim ETH", () => {
	    beforeEach(async () => {
		await buyNFT({
		    value: utils.parseEther('2'),
		    tokenId: 5, 
		    transitAddress: transitWallet.address,
		    nftAddress: nft.address,
		    escrowAddress: escrow.address,
		    buyerWallet,
		    messageHash
		});
	    });

	    it('transfers token from seller to escrow', async () => {
		expect(await nft.ownerOf(5)).to.be.eq(escrow.address);
	    });

	    it('it saves gift to escrow', async () => {
		const gift = await escrow.getGift(transitWallet.address);
		expect(gift.sender).to.eq(buyerWallet.address);
		expect(gift.claimEth).to.eq(utils.parseEther('1'));
		expect(gift.tokenAddress).to.eq(nft.address);
		expect(gift.tokenId).to.eq(5);
		expect(gift.status).to.eq(1); // not claimed
		expect(gift.nftPrice).to.eq(utils.parseEther('1'));
		expect(gift.msgHash).to.eq(messageHash); 		
	    });

	    it('does not transfer eth from buyer to escrow', async () => {
		const escrowBal = await deployerWallet.provider.getBalance(escrow.address);		
		expect(escrowBal).to.eq(utils.parseEther('1'));
	    });

	    it('donates to charity', async () => {
		const givethBal = await deployerWallet.provider.getBalance(givethBridgeMock.address);
		expect(givethBal).to.eq(utils.parseEther('0.99'));
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

    
    xdescribe("Cancelling gift", () =>  {
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

	
	describe("claimed gift", () => { 
	    it("can't cancel ", async () => {
		await claimGift({
		    transitWallet,
		    receiverAddress: transitWallet.address,
		    escrow
		});	  
		
		await expect(cancelGift({
		    transitAddress: transitWallet.address,
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
	    describe("with claim ETH ", () => {
		beforeEach(async () => {
		    await claimGift({
			transitWallet,
			receiverAddress,
			escrow
		    });	  
		});
		
		it("token goes to receiver", async () => {
		    const tokenOwner = await nft.ownerOf(1);
		    expect(tokenOwner).to.be.eq(receiverAddress);
		});

		it("gift status updated to claimed", async () => {
		    const gift = await escrow.getGift(transitWallet.address);
		    expect(gift.status).to.eq(2); // claimed
		});		
		
		it("eth goes to receiver", async () => {
		    const gift = await escrow.getGift(transitWallet.address);
		    const receiverBal = await deployerWallet.provider.getBalance(receiverAddress);
		    expect(receiverBal).to.eq(gift.claimEth);
		});
				
		it("can't claim the same gift twice", async () => {
		    await expect(claimGift({
			transitWallet,
			receiverAddress,
			escrow
		    })).to.be.reverted;
		});	    
	    });

	    
	    describe("without claim ETH", () => {
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
		    await claimGift({
			transitWallet: transitWallet2,
			receiverAddress,
			escrow
		    });	  
		});
		
		it("eth doesn't to receiver", async () => {
		    const gift = await escrow.getGift(transitWallet2.address);
		    const receiverBal = await deployerWallet.provider.getBalance(receiverAddress);
		    expect(receiverBal).to.eq(0);
		});
	    });	    
	});

	
	describe("cancelled gift", () => {
	    beforeEach(async () => {
		await claimGift({
		    transitWallet,
		    receiverAddress,
		    escrow
		});	  
	    });
	    
	    it("can't claim cancelled gift", async () => {
		await expect(claimGift({
		    transitWallet,
		    receiverAddress,
		    escrow
		})).to.be.reverted;		
	    });	    
	});

	
	describe("not existing gift", () => {
	    it("it reverts", async () => {
		await expect(claimGift({
		    transitWallet: fakeTransitWallet,
		    receiverAddress,
		    escrow
		})).to.be.reverted;		
	    });	    
	});		
    });
});

