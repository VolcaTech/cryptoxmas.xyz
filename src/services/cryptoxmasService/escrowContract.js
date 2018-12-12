import Promise from "bluebird";
import { utils } from "ethers";
import CryptoxmasEscrow from "../../../cryptoxmas-contracts/build/CryptoxmasEscrow.json";
import config from "../../../dapp-config.json";

class EscrowContractService {
  setup({ web3, network }) {
    this.web3 = web3;
    this.contractAddress = config[network].ESCROW_CONTRACT;

    // init contract object
    this.contract = web3.eth
      .contract(JSON.parse(CryptoxmasEscrow.interface))
      .at(this.contractAddress);
    Promise.promisifyAll(this.contract, { suffix: "Promise" });
  }

  async buyGift(tokenUri, transitAddress, amount, msgHash) {
    const weiAmount = this.web3.toWei(amount, "ether");
    return this.contract.buyGiftPromise(
      tokenUri,
      this.web3.toHex(transitAddress),
      msgHash,
      {
        from: this.web3.eth.accounts[0],
        value: weiAmount
        //gas: 110000
      }
    );
  }

  async getCardCategory(tokenUri) {
    const c = await this.contract.getTokenCategoryPromise(tokenUri);
    return {
      categoryId: c[0].toNumber(),
      minted: c[1].toNumber(),
      maxQnty: c[2].toNumber(),
      price: c[3]
    };
  }

  async claimGift({ transitWallet, receiverAddress }) {
    const gasPrice = utils.parseUnits("20", "gwei");
    //const gasLimit = 200000;

    const args = [receiverAddress];
    const data = new utils.Interface(
      CryptoxmasEscrow.interface
    ).functions.claimGift.encode(args);
    const tx = await transitWallet.sendTransaction({
      to: this.contractAddress,
      value: 0,
      data,
      gasPrice,
      //gasLimit
    });
    return tx;
  }
}

export default EscrowContractService;
