import React from "react";
import { getEtherscanLink } from "./components";
import styles from "./styles";

const PendingTxScreen = ({ transfer }) => {
  const etherscanLink = getEtherscanLink({
    txHash: transfer.txHash,
    networkId: transfer.networkId
  });

  return (
    <div>
      <div style={styles.textContainer}>
        <div
          style={{
            ...styles.greenTitle,
            marginBottom: 25
          }}
        >
          Magic happens…
        </div>
        <div
          style={{
            ...styles.whiteTitle,
            marginBottom: 40
          }}
        >
          Transaction is processing
        </div>
        <div style={styles.greyText}>
          It may take a moment.
          <br />
          You can check the
          <a target="_blank" href={etherscanLink} style={styles.etherscanLink}>
            status here
          </a>
        </div>
        <img
          style={styles.gifContainer}
          src={
            "https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/ball.gif"
          }
        />
      </div>
    </div>
  );
};

export default PendingTxScreen;
