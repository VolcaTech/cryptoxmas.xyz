import React, { Component } from "react";
import { SpinnerOrError, Loader } from "./../common/Spinner";
import { TransferScreen } from "../Transfer";
import ConfirmLinkScreen from "./ConfirmLinkScreen";

class ConfirmTransfer extends Component {
  render() {
    switch (this.props.transfer.status) {
      case "completed":
      case "cancelled":
      case "depositing":
      case "error":
        this.props.transfer.receiverPhone = this.props.phone;
        return <TransferScreen {...this.props} />;
    }

    return (
      <div>
        <ConfirmLinkScreen {...this.props} />
      </div>
    );
  }
}

export default ConfirmTransfer;
