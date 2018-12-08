import EscrowContract from "./escrowContract";
import NFTService from "./NFTService";
import config from "../../../dapp-config.json";
import { detectNetwork } from "../../utils";
import { Wallet, providers } from 'ethers';


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

  getGiftsForSale() {
    return this.nftService.tokensOf(config[this.network].SELLER_ADDRESS);
  }

  getTokenMetadata(tokenId) {
    return this.nftService.getMetadata(tokenId);
  }

  async getGift(transitPK) {
    const transitAddress = new Wallet(transitPK).address;

    const _parse = async g => {
      const tokenURI = g[5].toString();
      const tokenId = g[3].toString();
      const { image, name, description } = await this.nftService.getMetadata(
        tokenId,
        tokenURI
      );

      return {
        transitAddress,
        sender: g[0],
        amount: this.web3.fromWei(g[1], "ether").toString(),
        tokenAddress: g[2],
        tokenId,
        status: g[4].toString(),
        image,
        name,
        description
      };
    };
    const result = await this.escrowContract.contract.getGiftPromise(
      transitAddress
    );
    const parsed = await _parse(result);
    return parsed;
  }

  _generateTransferIdForLink(address) {
    return `link-${address}`;
  }

    async buyGift({ tokenAddress, tokenId, amountToPay }) {
	const wallet = Wallet.createRandom();
	const transitAddress = wallet.address;
	const transitPrivateKey = wallet.privateKey.substring(2);
	const transferId = this._generateTransferIdForLink(transitAddress);
	
	// // 3. send deposit to smart contract
	const txHash = await this.escrowContract.buyGift(
	    tokenAddress,
	    tokenId,
	    transitAddress,
	    amountToPay
	);
	return { txHash, transitPrivateKey, transferId, transitAddress };
  }

    async claimGift({ transitPrivateKey, receiverAddress }) {
	const provider = new providers.JsonRpcProvider(config[this.network].JSON_RPC_URL);
	const transitWallet = new Wallet(transitPrivateKey, provider);	
	const tx = await this.escrowContract.claimGift({transitWallet, receiverAddress});
	return { txHash: tx.hash, transferId: transitWallet.address };
  }
}

export default new CryptoxmasService();
