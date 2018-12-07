const Wallet = require("ethereumjs-wallet");
import EscrowContract from "./escrowContract";
//import ServerApi from "./serverApi";
import { signReceiverAddress } from "./utils";
import NFTService from "./NFTService";
import config from "../../../dapp-config.json";
import { detectNetwork } from "../../utils";

class CryptoxmasService {
  constructor() {
    this.escrowContract = new EscrowContract();
    this.nftService = new NFTService();
    //this.server = new ServerApi();
  }

  setup(web3) {
    this.web3 = web3;
    const { networkName } = detectNetwork(web3);
    const network = networkName.toLowerCase();
    this.network = network;
    this.escrowContract.setup({ web3, network });
    this.nftService.setup({ web3, network });
      //this.server.setup(network);
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
    const wallet = Wallet.generate();
    const transitAddress = wallet.getChecksumAddressString();
    const transitPrivateKey = wallet.getPrivateKeyString().substring(2);
    const transferId = this._generateTransferIdForLink(transitAddress);

    // 3. send deposit to smart contract
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
    const transitAddress = this._getAddressFromPrivateKey(transitPrivateKey);
    const transferId = this._generateTransferIdForLink(transitAddress);

    const { v, r, s } = signReceiverAddress({
      address: receiverAddress,
      transitPrivateKey
    });

    const result = await this.server.confirmLinkTx(
      transitAddress,
      receiverAddress,
      v,
      r,
      s
    );

    if (!result.success) {
      throw new Error(result.errorMessage || "Server error on withdrawal!");
    }

    return { txHash: result.txHash, amount: result.amount, transferId };
  }
}

export default new CryptoxmasService();
