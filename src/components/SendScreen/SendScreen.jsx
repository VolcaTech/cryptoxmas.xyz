import React, { Component } from "react";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import Footer from "./../common/poweredByVolca";
import TokenImage from "./../common/TokenImage";
import { buyGift } from "../../actions/transfer";
import NumberInput from "./../common/NumberInput";
import ButtonPrimary from "./../common/ButtonPrimary";
import { Error, ButtonLoader } from "./../common/Spinner";
import web3Service from "./../../services/web3Service";
import * as eth2gift from "../../services/eth2gift";

const styles = {
  title: {
    width: "90%",
    height: 110,
    display: "block",
    margin: "auto",
    fontSize: 24,
    lineHeight: 1.4,
    fontFamily: "SF Display Black",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 27
  },
  text1: {
    width: "85%",
    height: 68,
    display: "block",
    margin: "auto",
    fontSize: 15,
    lineHeight: "17px",
    fontFamily: "SF Display Regular",
    textAlign: "center",
    marginBottom: 36
  },
  container: {
    display: "flex",
    margin: "auto",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  numberInput: {
    display: "block",
    margin: "auto",
    width: "78%",
    height: 39,
    marginBottom: 19,
    marginTop: 19
  },
  sendButton: {
    width: "78%",
    display: "block",
    margin: "auto",
    marginTop: 20
  },
  spinner: {
    height: 28,
    textAlign: "center",
    marginTop: 10
  },
  betaText: {
    fontSize: 14,
    fontFamily: "Inter UI Regular",
    color: "#8B8B8B"
  },
  betaContainer: {
    paddingTop: 15,
    marginBottom: 50,
    height: 28,
    textAlign: "center"
  },
  betaBold: {
    fontFamily: "SF Display Bold"
  },
  blue: "#0099ff",
  blueOpacity: "#80ccff",
  hiddenInput: {
    height: 0,
    overflow: "hidden"
  }
};

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
      token: {}
    };
  }

  async componentDidMount() {
    try {
      const token = await eth2gift.getTokenMetadata(this.state.tokenId);
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
    return (
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
            Pack your gift
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
            Buy a Nifty and create your gift link!
          </div>
        </div>
        <TokenImage
          price={this.state.amount}
          url={this.state.token.image || ""}
        />
        <div
          style={{
            width: 300,
            margin: "auto",
            marginBottom: 40,
            fontFamily: "Inter UI Regular",
            fontSize: 18,
            color: "#8B8B8B",
            textAlign: "left"
          }}
        >
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
            <div style={styles.betaContainer}>
              <span style={styles.betaText}>
                You will get a simple link, sendable
                <br />
                via any messenger
              </span>
            </div>
          )}
        </div>
        <Footer />
      </Row>
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
