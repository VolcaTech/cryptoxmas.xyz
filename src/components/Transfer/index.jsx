import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllTransfers } from "../../data/selectors";
import DepositedScreen from "./DepositedScreen";
import CompletedReceivedScreen from "./CompletedReceivedScreen";
import PendingTxScreen from "./PendingTxScreen";
import CancelledTransferScreen from "./CancelledTransferScreen";
import TxErrorScreen from "./TxErrorScreen";

export class TransferComponent extends Component {
  render() {
    const { transfer, urlError } = this.props;
    // if transfer not found
    if (urlError) {
      return <div style={{ color: "red" }}>{urlError}</div>;
    }

    if (transfer.isError) {
      return <TxErrorScreen transfer={transfer} />;
    }

    // switch (transfer.status) {
    //   case "depositing":
    //   case "receiving":
    //     return <PendingTxScreen transfer={transfer} />;
    //   case "deposited":
    //     return <DepositedScreen transfer={transfer} />;
    //   case "received":
    //     return <CompletedReceivedScreen transfer={transfer} />;
    //   case "cancelled":
    //     return <CancelledTransferScreen />;
    //   default: {
    //     alert("Unknown status: " + transfer.status);
    //   }
    // }
    return <CompletedReceivedScreen transfer={transfer} />;
  }
}
const TransferScreen = props => <TransferComponent {...props} />;

const mapStateToProps = (state, props) => {
  const transferId = props.match.params.transferId;
  const transfer =
    getAllTransfers(state).filter(transfer => transfer.id === transferId)[0] ||
    {};
  let urlError = "";
  if (!transfer || !transfer.id) {
    urlError = "Transfer not found. Check the url!";
  }

  return {
    transfer,
    urlError
  };
};

export default connect(mapStateToProps)(TransferScreen);
