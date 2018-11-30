import React, { Component } from "react";
import { connect } from "react-redux";
import TransferStepsBar from "./../common/TransferStepsBar";
import { getAllTransfers } from "../../data/selectors";
import CompletedSentScreen from "./CompletedSentScreen";
import DepositedScreen from "./DepositedScreen";
import CompletedReceivedScreen from "./CompletedReceivedScreen";
import PendingTxScreen from "./PendingTxScreen";
import CancellingScreen from "./CancellingScreen";
import CancelledTransferScreen from "./CancelledTransferScreen";
import TxErrorScreen from "./TxErrorScreen";
import { Row, Col } from "react-bootstrap";

export class TransferComponent extends Component {
  render() {
    const { transfer, currentStep, urlError } = this.props;
    // if transfer not found
    if (urlError) {
      return <div style={{ color: "red" }}>{urlError}</div>;
    }

    if (transfer.isError) {
      return <TxErrorScreen transfer={transfer} />;
    }

    switch (transfer.status) {
      case "depositing":
      case "receiving":
        return <PendingTxScreen transfer={transfer} />;
      case "deposited":
        return <DepositedScreen transfer={transfer} />;
      case "sent":
      case "completed":
        return <CompletedSentScreen transfer={transfer} />;
      case "received":
        return <CompletedReceivedScreen transfer={transfer} />;
      case "cancelling":
        return <CancellingScreen transfer={transfer} />;
      case "cancelled":
        return <CancelledTransferScreen transfer={transfer} />;
      default: {
        alert("Unknown status: " + transfer.status);
      }
    }
  }
}
const TransferScreen = props => (
  <Row>
    <Col sm={4} smOffset={4}>
      <TransferComponent {...props} />
    </Col>
  </Row>
);

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
