import React from "react";
import { Row } from "react-bootstrap";
import RetinaImage from "react-retina-image";
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
      <RetinaImage
        className="img-responsive"
        style={{ margin: "auto" }}
        src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/oops.png"
      />
    </Row>
  );
};

export default CancelledTransferScreen;
