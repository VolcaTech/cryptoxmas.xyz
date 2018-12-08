import EscrowContract from "./escrowContract";
//import { signReceiverAddress } from "./utils";
import NFTService from "./NFTService";
import config from "../../../dapp-config.json";
import { detectNetwork } from "../../utils";
import { Wallet } from 'ethers';


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
      this.server = {};
  }

  getGiftsForSale() {
    return this.nftService.tokensOf(config[this.network].SELLER_ADDRESS);
  }

  getTokenMetadata(tokenId) {
    return this.nftService.getMetadata(tokenId);
  }

  async getGift(transitPK) {
    const transitAddress = this._getAddressFromPrivateKey(transitPK);

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

  _getAddressFromPrivateKey(privateKey) {
    return (
      "0x" +
      Wallet.fromPrivateKey(new Buffer(privateKey, "hex"))
        .getAddress()
        .toString("hex")
    );
  }

  cancelTransfer(transitAddress, contractVersion) {
    return this.escrowContract.cancel(transitAddress, contractVersion);
  }

  async claimGift({ transitPrivateKey, receiverAddress }) {
      
      
    //return { txHash: result.txHash, amount: result.amount, transferId };
  }
}

export default new CryptoxmasService();
