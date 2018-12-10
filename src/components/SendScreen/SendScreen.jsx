import React, { Component } from "react";
import { connect } from "react-redux";
import TokenImage from "./../common/TokenImage";
import { buyGift } from "../../actions/transfer";
import NumberInput from "./../common/NumberInput";
import ButtonPrimary from "./../common/ButtonPrimary";
import { Error, ButtonLoader } from "./../common/Spinner";
import QuestionButton from "./../common/QuestionButton";
import CharityPopUp from "./../common/CharityPopUp";
import { utils } from 'ethers';
import cryptoxmasService from "../../services/cryptoxmasService";
import styles from "./styles";

class SendScreen extends Component {
  constructor(props) {
    super(props);

    const cardId = props.match.params.cardId;
    const card = cryptoxmasService.getCard(cardId);
    this.state = {
      amount: card.price,
      addedEther: 0,
      errorMessage: "",
      fetching: false,
      buttonDisabled: false,
      numberInputError: false,
      cardId,
      card,
      cardMessage: "",
      charityPopupShown: false
    };
  }

    
  async _buyGift() {
    try {
      const transfer = await this.props.buyGift({
        message: this.state.cardMessage,
        amount: this.state.amount,
          cardId: this.state.cardId
      });
      this.props.history.push(`/transfers/${transfer.id}`);
    } catch (err) {
      let errorMsg = err.message;
      if (err.isOperational) errorMsg = "User denied transaction";
      this.setState({ fetching: false, errorMessage: errorMsg });
    }
  }

  _onSubmit() {
    // check amount
    if (this.state.amount <= 0) {
      this.setState({
        fetching: false,
        errorMessage: "Amount should be more than 0",
        numberInputError: true
      });
      return;
    }

    // disabling button
    this.setState({ fetching: true });

    // sending transfer
    setTimeout(() => {
      // let ui update
      this._buyGift();
    }, 100);
  }

  _renderForm() {
    let messageInputHeight = 50;
    let nftPrice = Number(this.state.card.price);
    let claimFee = 0.01;
    if (this.state.cardMessage.length) {
      messageInputHeight = 100;
    }
    if (this.state.cardMessage.length > 60) {
      messageInputHeight = 50 + (this.state.cardMessage.length / 20) * 25;
    }
    return (
      <div>
        <div style={styles.sendscreenTitleContainer}>
          {this.state.charityPopupShown ? (
            <CharityPopUp
              handleClick={() => this.setState({ charityPopupShown: false })}
            />
          ) : (
            ""
          )}
          <div style={styles.sendscreenGreenTitle}>Pack your gift</div>
        </div>
        <div style={{width: 300, margin: "auto", marginBottom: 20, color: "white", fontSize: 18, fontFamily: "Inter UI Regular"}}>1 out of 100 left</div>
        <TokenImage price={nftPrice} rarity="unique" url={this.state.card.metadata.image || ""} name={this.state.card.metadata.name} />
        <div style={styles.sendscreenGreyText}>
          All Ether from the sale of this Nifty
          <br />
          <div
            style={{ display: "inline" }}
            onClick={() => this.setState({ charityPopupShown: true })}
          >
            <span style={{ textDecoration: "underline" }}>
              will be sent to charity
            </span>
            <QuestionButton />
          </div>
        </div>
        <NumberInput
          onChange={({ target }) =>
            this.setState({
              amount: parseFloat(target.value || 0) + nftPrice,
              addedEther: parseFloat(target.value || 0),
              numberInputError: false,
              errorMessage: ""
            })
          }
          disabled={false}
          style={{ touchInput: "manipulation" }}
          placeholder="Wanna add ETH?"
          type="number"
          readOnly={false}
          error={this.state.numberInputError}
        />
        <div style={{ marginTop: 20 }}>
          <NumberInput
            onChange={({ target }) =>
              this.setState({
                cardMessage: target.value
              })
            }
            componentClass="textarea"
            rows={3}
            height={messageInputHeight}
            disabled={false}
            placeholder="Add gift message?"
            type="text"
            readOnly={false}
            error={this.state.numberInputError}
            maxLength={300}
            textAlign={this.state.cardMessage ? "left" : "center"}
          />
        </div>
        <div style={styles.sendButton}>
          <ButtonPrimary handleClick={this._onSubmit.bind(this)}>
            {this.state.fetching ? <ButtonLoader /> : "Buy & Send"}
          </ButtonPrimary>

          {this.state.fetching || this.state.errorMessage ? (
            <Error
              fetching={this.state.fetching}
              error={this.state.errorMessage}
            />
          ) : (
            <div style={styles.infoTextContainer}>
              <span style={styles.infoText}>
                ETH is securely held on the escrow Smart
                <br />
                Contract until the receiver claims it
              </span>
            </div>
          )}
        </div>
        <div style={{...styles.sendscreenGreyText, color: "white"}}>
          <span style={{ fontFamily: "Inter UI Bold" }}>
            Total: {this.state.amount} ETH
          </span>
          {this.state.addedEther ? (
            <div>Receiver will get: {this.state.addedEther} ETH</div>
          ) : (
            <br />
          )}
            <span>Donation: {(nftPrice - 0.01).toFixed(2)} ETH</span>
          <br />
          <span>Claim fee: {claimFee} ETH (for Gas)</span>
        </div>
      </div>
    );
  }

  render() {
    return <div>{this._renderForm()}</div>;
  }
}

export default connect(
  state => ({
    networkId: state.web3Data.networkId,
    balanceUnformatted: state.web3Data.balance
  }),
  { buyGift }
)(SendScreen);
