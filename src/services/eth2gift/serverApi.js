import urlGetter from "./serverUrl";

export const confirmLinkTx = (transitAddress, receiverAddress, v, r, s) => {
  const serverUrl = urlGetter.getServerUrl();

  const data = {
    transitAddress,
    receiverAddress,
    v,
    r,
    s
  };

  return fetch(`${serverUrl}/api/v1/receiver/claim-gift`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(response => response.json());
};

export const fetchTransfer = transferId => {
  const serverUrl = urlGetter.getServerUrl();
  return fetch(`${serverUrl}/api/v1/transfers/${transferId}`).then(response =>
    response.json()
  );
};
