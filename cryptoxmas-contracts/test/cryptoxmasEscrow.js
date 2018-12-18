import chai from "chai";
import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from "ethereum-waffle";
import { utils, Wallet, Contract } from "ethers";
import BasicNFT from "./../build/NFT";
import ERC20Mock from "./../build/ERC20Mock";
import CryptoxmasEscrow from "./../build/CryptoxmasEscrow";
import GivethBridge from "./../build/GivethBridge";
import {
  buyNFT,
  cancelGift,
  claimGift,
  genereteTransitWallet,
  erc20Approve
} from "./helpers";

chai.use(solidity);

const { expect } = chai;

describe("CryptoxmasEscrow", () => {
  let provider;
  let nft;
  let transitWallet;
  let escrow;
  let deployerWallet;
  let buyerWallet;
  let anotherBuyerWallet;
  let minNftPrice;
  let withEthAmount;
  let givethBridgeMock;
  let transitWallet2;
  let transitFee;
  let fakeTransitWallet;
  let messageHash = "Qme2tDivU5aF5d7XGuqwoFGxddfGiFsmposUcdXegAvEth";
  let tokenUri1 =
    "https://ipfs.infura.io/ipfs/QmbLR9VpdRKL6nb13BFJmDXYBjCdMvGyoP69VRdJoEZgP8";
  let tokenUri2 =
    "https://ipfs.infura.io/ipfs/QmZPiwDLeDaaPp5jatbDUAftxnNGrdEDomhDSLmk2ztB23";
  let tokenUri3 =
    "https://ipfs.infura.io/ipfs/QmeW9VoBpLUh2fHV4k6Dm8sgf5RTgmht1VGBGMLYb2GFbu";
  let rareCategory;
  let uniqueCategory;

  beforeEach(async () => {
    provider = createMockProvider();
    [
      deployerWallet,
      buyerWallet,
      anotherBuyerWallet,
      fakeTransitWallet
    ] = await getWallets(provider);

    transitWallet = genereteTransitWallet(provider);
    transitWallet2 = genereteTransitWallet(provider);

    // deploy escrow contract
    minNftPrice = utils.parseEther("0.05");
    withEthAmount = utils.parseEther("1.1");
    transitFee = utils.parseEther("0.01");

    // smart contract args
    givethBridgeMock = await deployContract(deployerWallet, GivethBridge, []);
    const givethCampaignId = 1;
    const tokenName = "Test NFT";
    const tokenSymbol = "TST";

    const escrowArgs = [
      givethBridgeMock.address,
      givethCampaignId,
      tokenName,
      tokenSymbol
    ];
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
      price: utils.parseEther("1")
    };

    // add token categories for sale
    await escrow.addTokenCategory(
      rareCategory.tokenUri,
      rareCategory.categoryId,
      rareCategory.maxQnty,
      rareCategory.price
    );
    await escrow.addTokenCategory(
      uniqueCategory.tokenUri,
      uniqueCategory.categoryId,
      uniqueCategory.maxQnty,
      uniqueCategory.price
    );
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

    it("can't add category with price less than MIN_PRICE", async () => {
      await expect(
        escrow.addTokenCategory(
          tokenUri3,
          rareCategory.categoryId,
          rareCategory.maxQnty,
          utils.parseEther("0.001")
        )
      ).to.be.reverted;
    });

    it("can't override existing token category", async () => {
      await expect(
        escrow.addTokenCategory(
          rareCategory.tokenUri,
          rareCategory.categoryId,
          rareCategory.maxQnty,
          rareCategory.price
        )
      ).to.be.reverted;
    });
  });

  describe("Buying", () => {
    describe("Common", () => {
      beforeEach(async () => {
        await buyNFT({
          value: rareCategory.price,
          tokenUri: rareCategory.tokenUri,
          transitAddress: transitWallet.address,
          escrowAddress: escrow.address,
          buyerWallet,
          messageHash
        });
      });

      it("Fails to buy token of Not exisiting category", async () => {
        await expect(
          buyNFT({
            value: rareCategory.price,
            tokenUri: rareCategory.tokenUri,
            transitAddress: transitWallet.address,
            escrowAddress: escrow.address,
            buyerWallet,
            messageHash
          })
        ).to.be.reverted;
      });

      it("Can't buy token with less ETH than category price", async () => {
        await expect(
          buyNFT({
            value: utils.parseEther("0.04"),
            tokenUri: rareCategory.tokenUri,
            transitAddress: transitWallet.address,
            escrowAddress: escrow.address,
            buyerWallet
          })
        ).to.be.reverted;
      });

      it("it saves gift to escrow", async () => {
        const gift = await escrow.getGift(transitWallet.address);
        expect(gift.tokenId).to.eq(1);
        expect(gift.tokenUri).to.eq(rareCategory.tokenUri);
        expect(gift.sender).to.eq(buyerWallet.address);
        expect(gift.claimEth).to.eq(0);
        expect(gift.status).to.eq(1); // not claimed
        expect(gift.nftPrice).to.eq(rareCategory.price);
        expect(gift.msgHash).to.eq(messageHash);
      });

      it("it mints new token", async () => {
        expect(await nft.ownerOf(1)).to.be.eq(escrow.address);
        expect(await nft.tokenURI(1)).to.be.eq(rareCategory.tokenUri);
      });

      it("it should update tokensCounter", async () => {
        expect(await escrow.tokensCounter()).to.be.eq(1);

        // buy one more nft
        await buyNFT({
          value: rareCategory.price,
          tokenUri: rareCategory.tokenUri,
          transitAddress: Wallet.createRandom().address,
          escrowAddress: escrow.address,
          buyerWallet,
          messageHash
        });

        expect(await escrow.tokensCounter()).to.be.eq(2);
      });

      it("doesn't allow to override gift", async () => {
        await expect(
          buyNFT({
            value: rareCategory.price,
            tokenUri: rareCategory.tokenUri,
            transitAddress: transitWallet.address,
            escrowAddress: escrow.address,
            buyerWallet,
            messageHash
          })
        ).to.be.reverted;
      });

      it("should fail if GivethBridge is paused", async () => {
        await givethBridgeMock.pause();
        await expect(
          buyNFT({
            value: rareCategory.price,
            tokenUri: rareCategory.tokenUri,
            transitAddress: Wallet.createRandom().address,
            escrowAddress: escrow.address,
            buyerWallet,
            messageHash
          })
        ).to.be.reverted;
      });
    });

    describe("Rare Category NFT", () => {
      describe("without ETH for receiver", () => {
        beforeEach(async () => {
          await buyNFT({
            value: rareCategory.price,
            tokenUri: rareCategory.tokenUri,
            transitAddress: transitWallet.address,
            escrowAddress: escrow.address,
            buyerWallet,
            messageHash
          });
        });

        it("it should update minted counter for category", async () => {
          let cat = await escrow.getTokenCategory(rareCategory.tokenUri);
          expect(await cat.minted).to.be.eq(1);

          // buy one more nft
          await buyNFT({
            value: rareCategory.price,
            tokenUri: rareCategory.tokenUri,
            transitAddress: Wallet.createRandom().address,
            escrowAddress: escrow.address,
            buyerWallet,
            messageHash
          });

          cat = await escrow.getTokenCategory(rareCategory.tokenUri);
          expect(await cat.minted).to.be.eq(2);
        });

        it("does not transfer eth from buyer to escrow", async () => {
          const escrowBal = await deployerWallet.provider.getBalance(
            escrow.address
          );
          expect(escrowBal).to.eq(0);
        });

        it("donates to charity", async () => {
          const givethBal = await deployerWallet.provider.getBalance(
            givethBridgeMock.address
          );
          expect(givethBal).to.eq(utils.parseEther("0.04"));
        });

        it("sends transit fee", async () => {
          const transitBal = await deployerWallet.provider.getBalance(
            transitWallet.address
          );
          expect(transitBal).to.eq(utils.parseEther("0.01"));
        });
      });

      describe("with ETH for receiver", () => {
        beforeEach(async () => {
          await buyNFT({
            value: utils.parseEther("1.05"),
            tokenUri: rareCategory.tokenUri,
            transitAddress: transitWallet.address,
            escrowAddress: escrow.address,
            buyerWallet,
            messageHash
          });
        });

        it("donates to charity", async () => {
          const givethBal = await deployerWallet.provider.getBalance(
            givethBridgeMock.address
          );
          expect(givethBal).to.eq(utils.parseEther("0.04"));
        });

        it("sends transit fee", async () => {
          const transitBal = await deployerWallet.provider.getBalance(
            transitWallet.address
          );
          expect(transitBal).to.eq(utils.parseEther("0.01"));
        });

        it("does keeps eth in escrow for receiver", async () => {
          const escrowBal = await deployerWallet.provider.getBalance(
            escrow.address
          );
          expect(escrowBal).to.eq(utils.parseEther("1"));
        });
      });
    });

    describe("Unique Category NFT", () => {
      describe("without ETH for receiver", () => {
        beforeEach(async () => {
          await buyNFT({
            value: uniqueCategory.price,
            tokenUri: uniqueCategory.tokenUri,
            transitAddress: transitWallet.address,
            escrowAddress: escrow.address,
            buyerWallet,
            messageHash
          });
        });

        it("it updates minted counter for category", async () => {
          let cat = await escrow.getTokenCategory(uniqueCategory.tokenUri);
          expect(await cat.minted).to.be.eq(1);
        });

        it("can't buy more tokens than allow category", async () => {
          let cat = await escrow.getTokenCategory(uniqueCategory.tokenUri);
          expect(await cat.minted).to.be.eq(1);

          // buy one more nft
          await expect(
            buyNFT({
              value: uniqueCategory.price,
              tokenUri: uniqueCategory.tokenUri,
              transitAddress: Wallet.createRandom().address,
              escrowAddress: escrow.address,
              buyerWallet,
              messageHash
            })
          ).to.be.reverted;
        });

        it("does not transfer eth from buyer to escrow", async () => {
          const escrowBal = await deployerWallet.provider.getBalance(
            escrow.address
          );
          expect(escrowBal).to.eq(0);
        });

        it("donates to charity", async () => {
          const givethBal = await deployerWallet.provider.getBalance(
            givethBridgeMock.address
          );
          expect(givethBal).to.eq(utils.parseEther("0.99"));
        });

        it("sends transit fee", async () => {
          const transitBal = await deployerWallet.provider.getBalance(
            transitWallet.address
          );
          expect(transitBal).to.eq(utils.parseEther("0.01"));
        });
      });

      describe("with ETH for receiver", () => {
        beforeEach(async () => {
          await buyNFT({
            value: utils.parseEther("2"),
            tokenUri: uniqueCategory.tokenUri,
            transitAddress: transitWallet.address,
            escrowAddress: escrow.address,
            buyerWallet,
            messageHash
          });
        });

        it("donates to charity", async () => {
          const givethBal = await deployerWallet.provider.getBalance(
            givethBridgeMock.address
          );
          expect(givethBal).to.eq(utils.parseEther("0.99"));
        });

        it("sends transit fee", async () => {
          const transitBal = await deployerWallet.provider.getBalance(
            transitWallet.address
          );
          expect(transitBal).to.eq(utils.parseEther("0.01"));
        });

        it("does keeps eth in escrow for receiver", async () => {
          const escrowBal = await deployerWallet.provider.getBalance(
            escrow.address
          );
          expect(escrowBal).to.eq(utils.parseEther("1"));
        });
      });
    });
  });

  describe("Cancelling gift", () => {
    let escrowTransitAddress;
    beforeEach(async () => {
      // buy nft to add ETH to contract, to test that it can't be drained
      escrowTransitAddress = Wallet.createRandom().address;
      await buyNFT({
        value: utils.parseEther("3"),
        tokenUri: rareCategory.tokenUri,
        transitAddress: escrowTransitAddress,
        escrowAddress: escrow.address,
        buyerWallet: anotherBuyerWallet,
        messageHash
      });

      // this gift is tested further
      await buyNFT({
        value: utils.parseEther("1"),
        tokenUri: rareCategory.tokenUri,
        transitAddress: transitWallet.address,
        escrowAddress: escrow.address,
        buyerWallet,
        messageHash
      });
    });

    describe("existing gift", () => {
      let gift;
      let escrowBalBefore;

      beforeEach(async () => {
        escrowBalBefore = await deployerWallet.provider.getBalance(
          escrow.address
        );
        const transitAddress = transitWallet.address;
        const buyer = buyerWallet;

        const cancelParams = {
          transitAddress,
          escrow,
          wallet: buyer
        };
        await cancelGift(cancelParams);
        gift = await escrow.getGift(transitWallet.address);
      });

      it("it changes gift status", async () => {
        expect(gift.status).to.eq(3); // cancelled
      });

      it("it transfers NFT to buyer", async () => {
        expect(await nft.ownerOf(2)).to.eq(buyerWallet.address);
      });

      it("it sends eth back to buyer", async () => {
        const escrowBal = await deployerWallet.provider.getBalance(
          escrow.address
        );
        const buyerBal = await deployerWallet.provider.getBalance(
          buyerWallet.address
        );
        expect(escrowBal).to.be.eq(utils.parseEther("2.95"));
      });

      it("can't cancel twice", async () => {
        await expect(
          cancelGift({
            transitAddress: transitWallet.address,
            escrow,
            wallet: buyerWallet
          })
        ).to.be.reverted;
      });
    });

    it("cannot cancel gift if not sender", async () => {
      await expect(
        cancelGift({
          transitAddress: deployerWallet.address,
          escrow,
          wallet: buyerWallet
        })
      ).to.be.reverted;
    });

    describe("not existing gift", () => {
      it("can't cancel ", async () => {
        await expect(
          cancelGift({
            transitAddress: deployerWallet.address,
            escrow,
            wallet: buyerWallet
          })
        ).to.be.reverted;
      });
    });

    describe("claimed gift", () => {
      it("can't cancel ", async () => {
        await claimGift({
          transitWallet,
          receiverAddress: transitWallet.address,
          escrow
        });

        await expect(
          cancelGift({
            transitAddress: transitWallet.address,
            escrow,
            wallet: buyerWallet
          })
        ).to.be.reverted;
      });
    });
  });

  describe("Claiming gift", () => {
    let receiverAddress;
    beforeEach(async () => {
      // buy nft to add ETH to contract, to test that it can't be drained
      await buyNFT({
        value: utils.parseEther("3"),
        tokenUri: rareCategory.tokenUri,
        transitAddress: Wallet.createRandom().address,
        escrowAddress: escrow.address,
        buyerWallet: anotherBuyerWallet,
        messageHash
      });

      // this gift is tested further
      receiverAddress = Wallet.createRandom().address;
      await buyNFT({
        value: utils.parseEther("1.05"),
        tokenUri: rareCategory.tokenUri,
        transitAddress: transitWallet.address,
        escrowAddress: escrow.address,
        buyerWallet,
        messageHash
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
          const tokenOwner = await nft.ownerOf(2);
          expect(tokenOwner).to.be.eq(receiverAddress);
        });

        it("gift status updated to claimed", async () => {
          const gift = await escrow.getGift(transitWallet.address);
          expect(gift.status).to.eq(2); // claimed
        });

        it("eth goes to receiver", async () => {
          const gift = await escrow.getGift(transitWallet.address);
          const receiverBal = await deployerWallet.provider.getBalance(
            receiverAddress
          );
          expect(receiverBal).to.eq(gift.claimEth);
          expect(receiverBal).to.eq(utils.parseEther("1"));
        });

        it("can't claim the same gift twice", async () => {
          await expect(
            claimGift({
              transitWallet,
              receiverAddress,
              escrow
            })
          ).to.be.reverted;
        });
      });

      describe("without claim ETH", () => {
        let relayerBalBefore;

        beforeEach(async () => {
          await buyNFT({
            value: rareCategory.price,
            tokenUri: rareCategory.tokenUri,
            transitAddress: transitWallet2.address,
            escrowAddress: escrow.address,
            buyerWallet,
            messageHash
          });
          await claimGift({
            transitWallet: transitWallet2,
            receiverAddress,
            escrow
          });
        });

        it("eth doesn't go to receiver", async () => {
          const gift = await escrow.getGift(transitWallet2.address);
          const receiverBal = await deployerWallet.provider.getBalance(
            receiverAddress
          );
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
        await expect(
          claimGift({
            transitWallet,
            receiverAddress,
            escrow
          })
        ).to.be.reverted;
      });
    });

    describe("not existing gift", () => {
      it("it reverts", async () => {
        await expect(
          claimGift({
            transitWallet: fakeTransitWallet,
            receiverAddress,
            escrow
          })
        ).to.be.reverted;
      });
    });
  });

  describe("With ERC-20 Token", () => {
    let erc20Mock;
    let initialBalance = utils.parseEther("1000");
    beforeEach(async () => {
      erc20Mock = await deployContract(deployerWallet, ERC20Mock, [
        buyerWallet.address,
        initialBalance
      ]);
    });
    describe("Buying", () => {
      it("it should keep tokens in escrow for receiver", async () => {
        const qty = utils.parseEther("1");
        await erc20Approve({
          erc20Address: erc20Mock.address,
          erc20Value: qty,
          spenderAddress: escrow.address,
          buyerWallet
        });
        await buyNFT({
          value: rareCategory.price,
          tokenUri: rareCategory.tokenUri,
          transitAddress: Wallet.createRandom().address,
          escrowAddress: escrow.address,
          buyerWallet,
          messageHash,
          erc20Address: erc20Mock.address,
          erc20Value: qty
        });
        const escrowBalance = await erc20Mock.balanceOf(escrow.address);
        expect(escrowBalance).to.eq(qty);
      });
      it("it reverts if value of tokens is 0", async () => {
        const qty = utils.parseEther("0");
        await erc20Approve({
          erc20Address: erc20Mock.address,
          erc20Value: qty,
          spenderAddress: escrow.address,
          buyerWallet
        });
        await expect(
          buyNFT({
            value: rareCategory.price,
            tokenUri: rareCategory.tokenUri,
            transitAddress: Wallet.createRandom().address,
            escrowAddress: escrow.address,
            buyerWallet,
            messageHash,
            erc20Address: erc20Mock.address,
            erc20Value: qty
          })
        ).to.be.reverted;
      });
    });
    describe("Cancelling", () => {
      it("Returns tokens to buyer", async () => {
        const qty = utils.parseEther("1");
        await erc20Approve({
          erc20Address: erc20Mock.address,
          erc20Value: qty,
          spenderAddress: escrow.address,
          buyerWallet
        });
        await buyNFT({
          value: rareCategory.price,
          tokenUri: rareCategory.tokenUri,
          transitAddress: transitWallet.address,
          escrowAddress: escrow.address,
          buyerWallet,
          messageHash,
          erc20Address: erc20Mock.address,
          erc20Value: qty
        });
        const cancelParams = {
          transitAddress: transitWallet.address,
          escrow,
          wallet: buyerWallet
        };
        await cancelGift(cancelParams);
        const buyerBalance = await erc20Mock.balanceOf(buyerWallet.address);
        expect(buyerBalance).to.eq(initialBalance);
      });
    });
    describe("Claiming", () => {
      it("Transfers tokens to receiver", async () => {
        const claimTransitWallet = genereteTransitWallet(provider);
        const receiverAddress = Wallet.createRandom().address;
        const qty = utils.parseEther("1");
        await erc20Approve({
          erc20Address: erc20Mock.address,
          erc20Value: qty,
          spenderAddress: escrow.address,
          buyerWallet
        });
        await buyNFT({
          value: rareCategory.price,
          tokenUri: rareCategory.tokenUri,
          transitAddress: claimTransitWallet.address,
          escrowAddress: escrow.address,
          buyerWallet,
          messageHash,
          erc20Address: erc20Mock.address,
          erc20Value: qty
        });
        await claimGift({
          transitWallet: claimTransitWallet,
          receiverAddress,
          escrow
        });
        const receiverBalance = await erc20Mock.balanceOf(receiverAddress);
        expect(receiverBalance).to.eq(qty);
      });
    });
  });
});
