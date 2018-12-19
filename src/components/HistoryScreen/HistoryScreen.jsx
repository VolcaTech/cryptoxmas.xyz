import React from "react";
import { connect } from "react-redux";
import { getTransfersForActiveAddress } from "./../../data/selectors";
import HistoryRow from "./row";
import { Row, Col } from "react-bootstrap";
import styles from "./styles";

class HistoryScreen extends React.Component {
  _renderRows() {
    return (
      <Col sm={12} style={{ paddingLeft: 0 }}>
        {this.props.transfers.map(transfer => (
          <HistoryRow
            transfer={transfer}
            networkId={this.props.networkId}
            key={transfer.id}
            address={this.props.address}
          />
        ))}
      </Col>
    );
  }

  _renderEmptyHistory() {
    return (
      <div style={{ margin: "0px 15px" }}>
        <div
          style={{
            ...styles.whiteTitle,
            marginBottom: 40
          }}
        >
          No cards sent or received yet
        </div>
        <div style={styles.tokenBorder}>
          <img
            className="img-responsive"
            style={styles.tokenImage}
            src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/Grinch.png"
          />
          <div style={styles.grinchText}>
            Seems like the Grinch
            <br />
            stole Christmas!{" "}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div style={styles.screen}>
        <Col sm={4} smOffset={4}>
          <div style={styles.sendscreenGreenTitle}>Gifts History</div>
        </Col>
        <Col sm={4} smOffset={4} style={{ padding: 0 }}>
          {this.props.transfers.length === 0
            ? this._renderEmptyHistory()
            : this._renderRows()}
        </Col>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    transfers: getTransfersForActiveAddress(state),
    address: state.web3Data.address,
    networkId: state.web3Data.networkId
  };
}

export default connect(mapStateToProps)(HistoryScreen);
