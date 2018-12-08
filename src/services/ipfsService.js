import Promise from "bluebird";
import ipfsClient from "ipfs-http-client";
import { getTransactionReceiptMined, detectNetwork } from "../utils";

const IpfsService = () => {
  let ipfs = ipfsClient('ipfs.infura.io', '5001', { protocol: 'https' });

    
  // api
  return {
    getIpfs: () => ipfs
  };
};

export default IpfsService();
