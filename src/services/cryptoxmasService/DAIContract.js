import Promise from "bluebird";
import ERC20 from "../../../cryptoxmas-contracts/build/ERC20.json";
import config from "../../../dapp-config.json";

class DAIService {
  setup({ web3, network }) {
    this.web3 = web3;
    this.network = network;
    this.escrowAddress = config[network].ESCROW_CONTRACT;
    // init contract object
    const DAIAddress = config[network].DAI_ADDRESS;
    const contract = web3.eth
      .contract(JSON.parse(ERC20.interface))
      .at(DAIAddress);
    Promise.promisifyAll(contract, { suffix: "Promise" });
    this.tokenContract = contract;
  }

  async Approve(amount) {
    const weiErc20Value = this.web3.toWei(amount, "ether");
    const txHash = await this.tokenContract.approvePromise(
      this.escrowAddress,
      weiErc20Value,
      {
        from: this.web3.eth.accounts[0]
      }
    );
    const txReceipt = await this.web3.eth.getTransactionReceiptMined(txHash);
    if (txReceipt.status === 0x0) {
      throw new Error("ERC-20 Approve failed.");
    }
  }

  async getApprovalEvents(params) {
    return new Promise((resolve, reject) => {
      const fromBlock = config[this.network].CONTRACT_BLOCK_DEPLOYMENT || 0;
      const eventsGetter = this.contract.Approval(params, { fromBlock });
      eventsGetter.get((error, response) => {
        if (error) {
          return reject(error);
        }
        resolve(response);
      });
    });
  }
}

export default DAIService;
