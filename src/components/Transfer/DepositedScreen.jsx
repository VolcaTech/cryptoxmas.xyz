import React, { Component } from "react";
import { getEtherscanLink } from "./components";
import TransferStepsBar from "./../common/TransferStepsBar";
import {
  HashRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import { ShareButton } from "./components";
import { Row, Col } from "react-bootstrap";
import Footer from "./../common/poweredByVolca";
import LinkInput from "./../common/NumberInput";
const ETH2PHONE_HOST = "https://cryptoxmas.xyz";

const styles = {
  titleContainer: {
    marginTop: 30,
    marginBottom: 12
  },
  subTitleContainer: {
    width: 320,
    margin: "auto",
    marginTop: 15
  },
  helpContainer: {
    marginTop: 27
  },
  stepsBar: {
    marginTop: 20
  },
  instructionsText: {
    lineHeight: "25px",
    color: "#000000",
    fontFamily: "SF Display Bold",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 20,
    marginTop: 46
  },
  greenBold: {
    color: "#2bc64f",
    fontFamily: "SF Display Bold"
  }
};

const DepositedScreen = ({ transfer }) => {
  let shareLink;

  shareLink = `${ETH2PHONE_HOST}/#/r?pk=${transfer.transitPrivateKey}`;

  if (transfer.networkId != "1") {
    shareLink += `&n=${transfer.networkId}`;
  }

  return (
    <Row>
      <div
        style={{ width: 354, margin: "auto", marginTop: 50, textAlign: "left" }}
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
        <LinkInput value={shareLink} />
      </div>
      <ShareButton transfer={transfer} />
      <Footer />
    </Row>
  );
};

export default DepositedScreen;
