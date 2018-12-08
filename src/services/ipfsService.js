import ipfsClient from "ipfs-http-client";

class IpfsService {
  constructor() {
    this.ipfs = ipfsClient("ipfs.infura.io", "5001", { protocol: "https" });
  }

  async saveMessage(message) {
    let dataBuffer = Buffer.from(JSON.stringify({ message }));
    const msgHash = (await this.ipfs.add(dataBuffer))[0].hash;
    return msgHash;
  }
}

export default new IpfsService();
