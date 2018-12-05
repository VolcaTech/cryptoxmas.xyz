import config from "../../../dapp-config.json";

class ServerApi {
  constructor() {
    this.host = null;
  }

  setup(network) {
    this.host = config[network].SERVER_HOST;
  }

  confirmLinkTx(transitAddress, receiverAddress, v, r, s) {
    const data = {
      transitAddress,
      receiverAddress,
      v,
      r,
      s
    };
    return fetch(`${this.host}/api/v1/receiver/claim-gift`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(response => response.json());
  }

  fetchTransfer(transferId) {
    return fetch(`${this.host}/api/v1/transfers/${transferId}`).then(response =>
      response.json()
    );
  }
}

export default ServerApi;
