import EscrowContract from "./escrowContract";
import DAIContract from "./DAIContract";
import config from "../../../dapp-config.json";
import { detectNetwork } from "../../utils";
import { getCategoryNameById } from "./utils";
import { Wallet, providers } from "ethers";
import mintedTokensJson from "../../../cryptoxmas-contracts/scripts/deployed/mintedTokens.json";
import { utils } from "ethers";
import BigNumber from "bignumber.js";

class CryptoxmasService {
  constructor() {
    this.escrowContract = new EscrowContract();
    this.daiContract = new DAIContract();
    this.nullAddress = "0x0000000000000000000000000000000000000000";
  }

  setup(web3) {
    this.web3 = web3;
    const { networkName } = detectNetwork(web3);
    const network = networkName.toLowerCase();
    this.network = network;
    this.escrowContract.setup({ web3, network });
    this.daiContract.setup({ web3, network });
    this.DAIAddress = config[network].DAI_ADDRESS;
  }

  getCardsForSale() {
    const cardsDct = mintedTokensJson[this.network];
    return Object.keys(cardsDct).map(cardId => {
      return this.getCard(cardId);
    });
  }

  getCard(cardId) {
    const card = mintedTokensJson[this.network][cardId];
    if (!card) {
      window.location.replace("/");
    }

    const category = getCategoryNameById(card.categoryId);
    return { ...card, cardId, category };
  }

  getBuyEvents(params) {
    return this.escrowContract.getBuyEvents(params);
  }

  getClaimEvents(params) {
    return this.escrowContract.getClaimEvents(params);
  }

  // fetch gift information from blockchain
  async getGift(transitPK) {
    const transitAddress = new Wallet(transitPK).address;

    const _getMessageFromIPFS = async msgHash => {
      let msg = "";
      if (msgHash && msgHash !== "0x0") {
        console.log("fetching msg...");
        const uri = `https://ipfs.infura.io/ipfs/${msgHash}`;
        const res = await fetch(uri).then(res => res.json());
        console.log("msg fetched");
        if (res && res.message) {
          msg = res.message;
        }
      }
      return msg;
    };

    const _parse = async g => {
      console.log({ g });
      const tokenId = g[0].toNumber();
      const tokenUri = g[1].toString();
      const card = this.getCard(utils.id(tokenUri));
      const msgHash = g[6].toString();
      const message = await _getMessageFromIPFS(msgHash);

      return {
        transitAddress,
        sender: g[1],
        amount: this.web3.fromWei(g[3], "ether").toString(),
        tokenId,
        status: g[5].toString(),
        msgHash,
        message,
        card,
        image: card.metadata.image,
        name: card.metadata.name,
        description: card.metadata.description
      };
    };
    const result = await this.escrowContract.contract.getGiftPromise(
      transitAddress
    );
    const parsed = await _parse(result);
    console.log({ parsed, result });
    return parsed;
  }

  _generateTransferIdForLink(address) {
    return `link-${address}`;
  }

  async getCardCategory(tokenUri) {
    return this.escrowContract.getCardCategory(tokenUri);
  }

  async buyGift({ tokenAddress, cardId, amountToPay, msgHash, DAIAmount }) {
    const wallet = Wallet.createRandom();
    const transitAddress = wallet.address;
    const transitPrivateKey = wallet.privateKey.substring(2);
    const transferId = this._generateTransferIdForLink(transitAddress);
    const card = this.getCard(cardId);

    if (parseFloat(DAIAmount) !== 0) {
      await this.daiContract.Approve(DAIAmount);
    }

    // // 3. send deposit to smart contract
    const txHash = await this.escrowContract.buyGift(
      card.tokenUri,
      transitAddress,
      amountToPay,
      msgHash,
      DAIAmount === "0" ? this.nullAddress : this.DAIAddress,
      DAIAmount
    );
    return { txHash, transitPrivateKey, transferId, transitAddress };
  }

  async claimGift({ transitPrivateKey, receiverAddress }) {
    const provider = new providers.JsonRpcProvider(
      config[this.network].JSON_RPC_URL
    );
    const transitWallet = new Wallet(transitPrivateKey, provider);
    const tx = await this.escrowContract.claimGift({
      transitWallet,
      receiverAddress
    });
    return { txHash: tx.hash, transferId: transitWallet.address };
  }
}

export default new CryptoxmasService();
