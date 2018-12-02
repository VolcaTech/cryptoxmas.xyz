import React from "react";
import { getEtherscanLink } from "./components";
import { Row } from "react-bootstrap";
import Footer from "./../common/poweredByVolca";

const PendingTxScreen = ({ transfer }) => {
  const etherscanLink = getEtherscanLink({
    txHash: transfer.txHash,
    networkId: transfer.networkId
  });

  return (
    <div>
      <Row>
        <div
          style={{
            width: 354,
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
            Magic happens…
          </div>
          <div
            style={{
              marginBottom: 40,
              fontFamily: "Inter UI Medium",
              fontSize: 24,
              color: "white",
              textAlign: "left"
            }}
          >
            Transaction is processing
          </div>
          <div
            style={{
              marginBottom: 50,
              fontFamily: "Inter UI Regular",
              fontSize: 18,
              color: "#8B8B8B",
              textAlign: "left"
            }}
          >
            It may take a few minutes. You can
            <br />
            check the status later here
            <div style={{ marginTop: 8 }}>
              Details on{" "}
              <a
                target="_blank"
                href={etherscanLink}
                style={{ textDecoration: "underline", color: "#8B8B8B" }}
              >
                {" "}
                Etherscan
              </a>
            </div>
          </div>
        </div>
      </Row>
      <div style={{ width: "100%", bottom: 0, position: "fixed" }}>
        <Footer />
      </div>
    </div>
  );
};

export default PendingTxScreen;
