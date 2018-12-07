import React, { Component } from "react";
import styles from "./styles";

class UnsupportedNetwork extends Component {
  render() {
    return (
      <div style={{ color: "white" }}>
        <div style={styles.unsupportedNetworkScreenTitle}>
          Network is not supported
        </div>
        <div style={styles.unsupportedNetworkScreenContainer}>
          <div style={styles.unsupportedNetworkScreenText}>
            We support Ropsten Test Network
            <br />
            <br />
            How to change Network:
            <br />
            1. Go to Settings in your wallet app
            <br />
            2. Switch Network to Ropsten
            <br />
            3. Back to DApp browser in your wallet and reload the receiver’s
            link
          </div>
        </div>
      </div>
    );
  }
}

export default UnsupportedNetwork;
