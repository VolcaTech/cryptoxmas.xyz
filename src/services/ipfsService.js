import Promise from "bluebird";
import ipfsClient from "ipfs-http-client";
import { getTransactionReceiptMined, detectNetwork } from "../utils";

const IpfsService = () => {
  let ipfs;

  async function setup() {
    // Connect to Infura IPFS gateway.
    ipfs = ipfsClient('ipfs.infura.io', '5001', { protocol: 'https' });

    return ipfs;
  }

  // api
  return {
    getIpfs: () => ipfs,
    setup
  };
};

export default IpfsService();
