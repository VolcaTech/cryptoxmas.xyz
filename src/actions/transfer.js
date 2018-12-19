import ipfsService from "./../services/ipfsService";
import web3Service from "../services/web3Service";
import {
  getTransfersForActiveAddress,
  getDepositingTransfers,
  getReceivingTransfers,
  getCancellingTransfers
} from "./../data/selectors";
import cryptoxmasService from "../services/cryptoxmasService";
import * as actionTypes from "./types";
import { updateBalance } from "./web3";

const createTransfer = payload => {
  return {
    type: actionTypes.CREATE_TRANSFER,
    payload
  };
};

const updateTransfer = payload => {
  return {
    type: actionTypes.UPDATE_TRANSFER,
    payload
  };
};

const subscribePendingTransferMined = (transfer, nextStatus, txHash) => {
  return async dispatch => {
    const web3 = web3Service.getWeb3();

    const txReceipt = await web3.eth.getTransactionReceiptMined(
      txHash || transfer.txHash
    );

    const isError = !(txReceipt.status === "0x1" && txReceipt.logs.length > 0);
    dispatch(
      updateTransfer({
        status: nextStatus,
        isError,
        id: transfer.id,
        txHash: txHash || transfer.txHash
      })
    );

    setTimeout(() => {
      dispatch(updateBalance());
    }, 10000);
  };
};

// find all pending transfers and update status when they will be mined
export const subscribePendingTransfers = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const depositingTransfers = getDepositingTransfers(state);
    const receivingTransfers = getReceivingTransfers(state);
    const cancellingTransfers = getCancellingTransfers(state);

    depositingTransfers.map(transfer => {
      dispatch(subscribePendingTransferMined(transfer, "deposited"));
    });
    receivingTransfers.map(transfer => {
      dispatch(subscribePendingTransferMined(transfer, "received"));
    });
    cancellingTransfers.map(transfer => {
      dispatch(subscribePendingTransferMined(transfer, "cancelled"));
    });
  };
};

export const fetchBuyEvents = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const depositingTransfers = getDepositingTransfers(state);

    // get pending depositing transfers from blockchain
    try {
      const params = { sender: state.web3Data.address };
      const buyEvents = await cryptoxmasService.getBuyEvents(params);
      console.log("got buy events");
      console.log({ buyEvents });
      buyEvents.map(buyEvent => {
        depositingTransfers.map(transfer => {
          if (transfer.transitAddress === buyEvent.args.transitAddress) {
            console.log("Updating transfer", { transfer, buyEvent });
            transfer.txHash = buyEvent.transactionHash;

            dispatch(
              subscribePendingTransferMined(
                transfer,
                "deposited",
                transfer.txHash
              )
            );
          }
        });
      });
    } catch (err) {
      console.log("Error while fetching buy events");
      console.log(err);
    }
  };
};

export const buyGift = ({ message, amount, cardId }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const networkId = state.web3Data.networkId;
    const senderAddress = state.web3Data.address;
    let msgHash = "";
    if (message) {
      msgHash = await ipfsService.saveMessage(message);
    }

    const {
      txHash,
      transitPrivateKey,
      transferId,
      transitAddress
    } = await cryptoxmasService.buyGift({
      cardId,
      amountToPay: amount,
      senderAddress,
      msgHash
    });
    const id = `${transferId}-out`;

    const transfer = {
      id,
      txHash,
      transitPrivateKey,
      transferId,
      cardId,
      transitAddress: transitAddress.toLowerCase(),
      networkId,
      senderAddress,
      status: "depositing",
      timestamp: Date.now(),
      amount,
      direction: "out"
    };

    dispatch(createTransfer(transfer));
    // subscribe
    dispatch(subscribePendingTransferMined(transfer, "deposited"));

    return transfer;
  };
};

export const claimGift = ({ transitPrivateKey, gift }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const networkId = state.web3Data.networkId;
    const receiverAddress = state.web3Data.address;

    const result = await cryptoxmasService.claimGift({
      transitPrivateKey,
      receiverAddress
    });

    const id = `${result.transferId}-IN`;
    const txHash = result.txHash;
    const transfer = {
      id,
      txHash,
      transferId: result.transferId,
      status: "receiving",
      networkId,
      receiverAddress,
      timestamp: Date.now(),
      gift,
      direction: "in"
    };
    dispatch(createTransfer(transfer));

    // // subscribe
    dispatch(subscribePendingTransferMined(transfer, "received"));
    return transfer;
  };
};

export const cancelTransfer = transfer => {
  return async dispatch => {
    // take contract redeploy into account

    const txHash = await cryptoxmasService.cancelTransfer(
      transfer.transitAddress
    );

    dispatch(
      updateTransfer({
        status: "cancelling",
        id: transfer.id,
        txHash
      })
    );

    // // subscribe
    transfer.txHash = txHash;
    dispatch(subscribePendingTransferMined(transfer, "cancelled"));
    return transfer;
  };
};

export const fetchClaimEvents = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const address = state.web3Data.address;
    const activeAddressTransfers = getTransfersForActiveAddress(state);

    try {
      const params = { sender: address };
      const events = await cryptoxmasService.getClaimEvents(params);
      console.log({ events });
      events.map(event => {
        const { transitAddress, sender } = event.args;
        activeAddressTransfers
          .filter(
            transfer =>
              transfer.status === "deposited" &&
              transfer.transitAddress === transitAddress &&
              transfer.senderAddress === sender
          )
          .map(transfer => {
            dispatch(
              updateTransfer({
                status: "sent",
                id: transfer.id
              })
            );
          });
      });
    } catch (err) {
      console.log("Error while getting events", err);
    }
  };
};
