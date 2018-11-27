import Promise from "bluebird";
import sha3 from 'solidity-sha3';
import urlGetter from './serverUrl';
const Wallet = require('ethereumjs-wallet');


export const confirmLinkTx = (transitAddress, receiverAddress, v, r, s) => {
    const serverUrl = urlGetter.getServerUrl();

    const data = {
        transitAddress,
        receiverAddress,
        v,
        r,
        s
    };
    console.log(serverUrl, data)

    return fetch(`${serverUrl}/api/v1/receiver/claim-gift`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => response.json());
}


export const fetchTransfer = (transferId) => {
    const serverUrl = urlGetter.getServerUrl();
    return fetch(`${serverUrl}/api/v1/transfers/${transferId}`)
        .then((response) => response.json());
}
