import React from "react";
import { ShareButton } from "./components";
import { Row } from "react-bootstrap";
import LinkInput from "./../common/NumberInput";
const HOST = "https://app.cryptoxmas.xyz";

const DepositedScreen = ({ transfer }) => {
  let shareLink;

  shareLink = `${HOST}/#/r?pk=${transfer.transitPrivateKey}`;

  if (transfer.networkId !== "1") {
    shareLink += `&n=${transfer.networkId}`;
  }

  return (
    <div>
        <div
          style={{
            width: 320,
            margin: "auto",
            marginTop: 50,
            textAlign: "left"
          }}
        >
          <div
            style={{
              marginBottom: 25,
              fontFamily: "Inter UI Medium",
              fontSize: 30,
              color: "#4CD964",
              textAlign: "left"
            }}
          >
            We generated a link
          </div>
          <div
            style={{
              marginBottom: 150,
              fontFamily: "Inter UI Medium",
              fontSize: 24,
              color: "white",
              textAlign: "left"
            }}
          >
            Now you can send it to
            <br />
            anyone — just like a<br />
            text message
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <LinkInput value={shareLink} readOnly={true} />
        </div>
        <ShareButton transfer={transfer} />
    </div>
  );
};

export default DepositedScreen;
