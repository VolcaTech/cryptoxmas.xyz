import React from "react";
import { getEtherscanLink } from "./components";
import { Row } from "react-bootstrap";
import styles from "./styles";


const TxErrorScreen = ({ transfer }) => {
  const etherscanLink = getEtherscanLink({
    txHash: transfer.txHash,
    networkId: transfer.networkId
  });
  return (
    <Row>
      <div style={styles.textContainer}>
        <div style={{ ...styles.greenTitle, marginBottom: 25 }}>
          Transaction failed
        </div>
        <div
          style={{
            ...styles.whiteTitle,
            marginBottom: 55
          }}
        >
          Something went wrong. Check details on 
          <a
            target="_blank"
            href={etherscanLink}
            style={{ textDecoration: "underline", color: "#4CD964", marginLeft: 7 }}
          >
            Etherscan
          </a>
        </div>
      </div>
      <img
        style={{
          display: "block",
          margin: "auto",
          height: 200,
          width: 200
        }}
        src={
          "https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/boom.gif"
        }
      />
    </Row>
  );
};

export default TxErrorScreen;
