import React from "react";
import TokenImage from "./../common/TokenImage";
import ButtonPrimary from "./../common/ButtonPrimary";
import ReactCardFlip from "react-card-flip";
import { getEtherscanLink } from "./components";
import QuestionButton from "./../common/QuestionButton";
import styles from "./styles";

class CompletedReceivedScreen extends React.Component {
  state = {
    isFlipped: false
  };

  render() {
    const transfer = this.props.transfer;
    const gift = transfer.gift || {};
    console.log(gift);
    const etherscanLink = getEtherscanLink({
      txHash: transfer.txHash,
      networkId: transfer.networkId
    });
    return (
      <div>
        <div>
          <div style={styles.textContainer}>
            <div style={{ ...styles.greenTitle, marginBottom: 20 }}>
              Hooray!
            </div>
            <div style={{ ...styles.whiteTitle, marginBottom: 40 }}>
              You claimed a{" "}
              <span style={{ textDecoration: "underline" }}>Nifty token</span>
              <br />
              and <span style={{ color: "#4CD964" }}>{gift.amount}</span> ETH
            </div>
            <div style={{ height: 300, marginBottom: 20 }}>
              <ReactCardFlip isFlipped={this.state.isFlipped}>
                <TokenImage
                  url={gift.image}
                  name={gift.name}
                  hidePrice={true}
                  key="front"
                />
                <TokenImage
                  message="I’m a big proponent of onboarding users into the world of consumer crypto"
                  hidePrice={true}
                  key="back"
                />
              </ReactCardFlip>
            </div>
          </div>
          <ButtonPrimary
            handleClick={() =>
              this.setState({ isFlipped: !this.state.isFlipped })
            }
            buttonColor={this.state.isFlipped ? "white" : "#D9544C"}
            fontColor={this.state.isFlipped ? "#D9544C" : "white"}
          >
            {this.state.isFlipped ? "Close" : "Read message"}
          </ButtonPrimary>
          <div
            style={{
              ...styles.greyText,
              width: 300,
              margin: "auto",
              marginTop: 20
            }}
          >
            With this gift your friend sent
            <div style={{ marginBottom: 2 }}>
              <span style={{ color: "#4CD964" }}>0.05 ETH </span>
              <span style={{ textDecoration: "underline" }}>to charity</span>
              <QuestionButton/>
            </div>
            Details on
            <a
              target="_blank"
              href={etherscanLink}
              style={styles.etherscanLink}
            >
              Etherscan
            </a>
          </div>
          <div style={{ marginTop: 40 }}>
            <ButtonPrimary>So what's next</ButtonPrimary>
          </div>
        </div>
      </div>
    );
  }
}

export default CompletedReceivedScreen;
