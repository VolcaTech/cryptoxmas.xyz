import React from "react";
import { Row } from "react-bootstrap";
import styles from "./styles";

const CancelledTransferScreen = () => {
  return (
    <Row>
      <div style={styles.textContainer}>
        <div style={{ ...styles.greenTitle, marginBottom: 25 }}>Oops!</div>
        <div
          style={{
            ...styles.whiteTitle,
            marginBottom: 55
          }}
        >
          Link is cancelled
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

export default CancelledTransferScreen;
