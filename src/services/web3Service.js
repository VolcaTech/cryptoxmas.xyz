import Promise from "bluebird";
import getWeb3 from "../utils/getWeb3";
import { getTransactionReceiptMined, detectNetwork } from "../utils";

const Web3Service = () => {
  let web3, address;

  async function setup() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    web3 = await getWeb3();
    if (!web3) {
      throw new Error("Web3 is not connected");
    }
    Promise.promisifyAll(web3.eth, { suffix: "Promise" });
    web3.eth.getTransactionReceiptMined = getTransactionReceiptMined;
      
    address = (await web3.eth.getAccountsPromise())[0];
    const balance = address ? await web3.eth.getBalancePromise(address) : 0;
    const connected = web3.isConnected();
    const { networkName, networkId } = detectNetwork(web3);

    return {
      web3,
      balance,
      address,
      connected,
      networkName,
      networkId
    };
  }

  // api
  return {
    getWeb3: () => web3,
    setup,
    getAddress: address
  };
};

export default Web3Service();
