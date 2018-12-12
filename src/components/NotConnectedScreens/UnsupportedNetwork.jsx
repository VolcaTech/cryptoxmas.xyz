import React, { Component } from "react";
import RetinaImage from "react-retina-image";
import styles from "./styles";

class UnsupportedNetwork extends Component {
  render() {
    return (
      <div style={{ }}>
        
        <div style={styles.unsupportedNetworkScreenContainer}>
        <div style={styles.unsupportedNetworkScreenTitle}>
          Network is not supported
        </div>
          <div style={styles.unsupportedNetworkScreenText}>
            Please set your wallet to
            <br />
            Ethereum Mainnet, Ropsten or Rinkeby Testnet
          </div>
          <RetinaImage
          className="img-responsive"
          src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/change_network.png"
        />
        </div>
       
      </div>
    );
  }
}

export default UnsupportedNetwork;
