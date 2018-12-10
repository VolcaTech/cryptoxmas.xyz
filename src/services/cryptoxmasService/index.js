import EscrowContract from "./escrowContract";
import NFTService from "./NFTService";
import config from "../../../dapp-config.json";
import { detectNetwork } from "../../utils";
import { Wallet, providers } from "ethers";
import mintedTokensJson from '../../../cryptoxmas-contracts/scripts/deployed/mintedTokens.json';


class CryptoxmasService {
  constructor() {
    this.escrowContract = new EscrowContract();
    this.nftService = new NFTService();
  }

  setup(web3) {
    this.web3 = web3;
    const { networkName } = detectNetwork(web3);
    const network = networkName.toLowerCase();
    this.network = network;
    this.escrowContract.setup({ web3, network });
    this.nftService.setup({ web3, network });
  }

    getCardsForSale() {
	const cardsDct = mintedTokensJson[this.network];
	return Object.keys(cardsDct).map(cardId => {
	    return { ...cardsDct[cardId], cardId };
      });
  }

  getCard(cardId) {
      return mintedTokensJson[this.network][cardId];
  }

  // fetch gift information from blockchain
  async getGift(transitPK) {
    const transitAddress = new Wallet(transitPK).address;

    const _getMessageFromIPFS = async msgHash => {
      let msg = "";
      if (msgHash && msgHash !== "0x0") {
        console.log("fetching msg...");
        const uri = `https://ipfs.io/ipfs/${msgHash}`;
        const res = await fetch(uri).then(res => res.json());
        if (res && res.message) {
          msg = res.message;
        }
      }
      return msg;
    };

    const _parse = async g => {
      const tokenURI = g[5].toString();
      const tokenId = g[3].toString();
      const { image, name, description } = await this.nftService.getMetadata(
        tokenId,
        tokenURI
      );
      const msgHash = g[7].toString();
      const message = await _getMessageFromIPFS(msgHash);

      return {
        transitAddress,
        sender: g[0],
        amount: this.web3.fromWei(g[1], "ether").toString(),
        tokenAddress: g[2],
        tokenId,
        status: g[4].toString(),
        msgHash,
        message,
        image,
        name,
        description
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

  async buyGift({ tokenAddress, cardId, amountToPay, msgHash }) {
    const wallet = Wallet.createRandom();
    const transitAddress = wallet.address;
    const transitPrivateKey = wallet.privateKey.substring(2);
    const transferId = this._generateTransferIdForLink(transitAddress);
    const card = this.getCard(cardId);
    
    // // 3. send deposit to smart contract
    const txHash = await this.escrowContract.buyGift(
      card.tokenUri,
      transitAddress,
      amountToPay,
      msgHash
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
