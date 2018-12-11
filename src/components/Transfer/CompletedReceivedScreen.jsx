import React from "react";
import TokenImage from "./../common/TokenImage";
import ButtonPrimary from "./../common/ButtonPrimary";
import ReactCardFlip from "react-card-flip";
import { getEtherscanLink } from "./components";
import QuestionButton from "./../common/QuestionButton";
import CharityPopUp from "./../common/CharityPopUp";
import WhatsNextPopUp from "./../common/WhatsNextPopUp";
import styles from "./styles";

class CompletedReceivedScreen extends React.Component {
  state = {
    isFlipped: false,
    charityPopupShown: false,
    whatsNextPopupShown: false
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
              {gift.amount > 0 ? (
                <span>
                  and <span style={{ color: "#4CD964" }}>{gift.amount}</span>{" "}
                  ETH
                </span>
              ) : (
                ""
              )}
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
                  message={gift.message}
                  hidePrice={true}
                  key="back"
                />
              </ReactCardFlip>
            </div>
            {this.state.charityPopupShown ? (
              <CharityPopUp
                handleClick={() => this.setState({ charityPopupShown: false })}
              />
            ) : (
              ""
            )}
            {this.state.whatsNextPopupShown ? (
              <WhatsNextPopUp
                handleClick={() =>
                  this.setState({ whatsNextPopupShown: false })
                }
              />
            ) : (
              ""
            )}
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
              <span style={{ color: "#4CD964" }}>{gift.card.price} ETH </span>
              <div
                style={{ display: "inline" }}
                onClick={() => this.setState({ charityPopupShown: true })}
              >
                <span style={{ textDecoration: "underline" }}>to charity</span>
                <QuestionButton />
              </div>
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
            <ButtonPrimary
              handleClick={() => this.setState({ whatsNextPopupShown: true })}
            >
              So what's next
            </ButtonPrimary>
          </div>
        </div>
      </div>
    );
  }
}

export default CompletedReceivedScreen;
