import React from "react";
import TokenImage from "./../common/TokenImage";
import styles from "./styles";

const CompletedReceivedScreen = ({ transfer }) => {
  const gift = transfer.gift || {};

  return (
    <div>
      <div style={{ height: innerHeight }}>
        <div style={styles.textContainer}>
          <div style={{ ...styles.greenTitle, marginBottom: 20 }}>Hooray!</div>
          <div style={{ ...styles.whiteTitle, marginBottom: 40 }}>
            You received {gift.name}
            <br />
            and <span style={{ color: "#4CD964" }}>{gift.amount}</span> ETH
          </div>
          <TokenImage url={gift.image} />
        </div>
      </div>
    </div>
  );
};

export default CompletedReceivedScreen;
