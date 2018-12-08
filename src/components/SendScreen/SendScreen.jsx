import React, { Component } from "react";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import TokenImage from "./../common/TokenImage";
import { buyGift } from "../../actions/transfer";
import NumberInput from "./../common/NumberInput";
import ButtonPrimary from "./../common/ButtonPrimary";
import { Error, ButtonLoader } from "./../common/Spinner";
import web3Service from "./../../services/web3Service";
import cryptoxmasService from "../../services/cryptoxmasService";
import styles from "./styles";

class SendScreen extends Component {
  constructor(props) {
    super(props);

    const tokenId = props.match.params.tokenId;

    this.state = {
      amount: 0.05,
      errorMessage: "",
      fetching: false,
      buttonDisabled: false,
      checked: false,
      checkboxTextColor: "#000",
      numberInputError: false,
      phoneError: false,
      phoneOrLinkActive: false,
      tokenId,
      token: {},
      cardMessage: ""
    };
  }

  async componentDidMount() {
    try {
      const token = await cryptoxmasService.getTokenMetadata(
        this.state.tokenId
      );
      this.setState({
        fetching: false,
        token
      });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: "Error occured while getting token from blockchain!"
      });
    }
  }

  async _buyGift() {
    try {
      const transfer = await this.props.buyGift({
        amount: this.state.amount,
        tokenId: this.state.tokenId
      });
      this.props.history.push(`/transfers/${transfer.id}`);
    } catch (err) {
      let errorMsg = err.message;
      if (err.isOperational) errorMsg = "User denied transaction";
      this.setState({ fetching: false, errorMessage: errorMsg });
    }
  }

  _onSubmit() {
    //format balance
    let balance;
    console.log("onSubmit");
    const web3 = web3Service.getWeb3();
    if (this.props.balanceUnformatted) {
      balance = web3.fromWei(this.props.balanceUnformatted, "ether").toNumber();
    }

    // check amount
    if (this.state.amount <= 0) {
      this.setState({
        fetching: false,
        errorMessage: "Amount should be more than 0",
        numberInputError: true
      });
      return;
    }

    // check wallet has enough ether
    if (this.state.amount > balance) {
      this.setState({
        fetching: false,
        errorMessage: "Not enough ETH on your balance",
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
    if (this.state.cardMessage.length) {
      messageInputHeight = 100;
    }
    if (this.state.cardMessage.length > 60) {
        messageInputHeight = 50 + (this.state.cardMessage.length / 20) * 25;
      }
    return (
      <div>
        <div style={styles.sendscreenTitleContainer}>
          <div style={styles.sendscreenGreenTitle}>Pack your gift</div>
          <div style={styles.sendscreenWhiteTitle}>
            Buy a Nifty and create your gift link!
          </div>
        </div>
        <TokenImage
          price={this.state.amount}
          url={this.state.token.image || ""}
        />
        <div style={styles.sendscreenGreyText}>
          All Ether from the sale of this Nifty
          <br />
          <span style={{ textDecoration: "underline" }}>
            will be sent to charity
          </span>
        </div>
        <NumberInput
          onChange={({ target }) =>
            this.setState({
              amount: parseFloat(target.value) + 0.05,
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
                You will get a simple link, sendable
                <br />
                via any messenger
              </span>
            </div>
          )}
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
