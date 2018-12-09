import React from "react";
import { ShareButton } from "./components";
import LinkInput from "./../common/NumberInput";
import styles from "./styles";

const DepositedScreen = ({ transfer }) => {
  let shareLink;
  const host = `${window.location.protocol}//${window.location.host}`;
  shareLink = `${host}/#/r?pk=${transfer.transitPrivateKey}`;
  if (transfer.networkId !== "1") {
    shareLink += `&n=${transfer.networkId}`;
  }

  return (
    <div>
      <div style={styles.textContainer}>
        <div
          style={{
            ...styles.greenTitle,
            marginBottom: 25
          }}
        >
          We generated a link
        </div>
        <div
          style={{
            ...styles.whiteTitle,
            marginBottom: 150
          }}
        >
          Now you can send it to
          <br />
          anyone — just like a<br />
          text message
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <LinkInput value={shareLink} readOnly={false} />
      </div>
      <ShareButton transfer={transfer} shareLink={shareLink} />
    </div>
  );
};

export default DepositedScreen;
