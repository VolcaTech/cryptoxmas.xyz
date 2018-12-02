import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Grid } from "react-bootstrap";
import RetinaImage from "react-retina-image";
import * as eth2gift from "../../services/eth2gift";
import ButtonPrimary from "./../common/ButtonPrimary";
import { SpinnerOrError, Loader, ButtonLoader } from "./../common/Spinner";
import { getNetworkNameById } from "../../utils";
const qs = require("querystring");
import { claimGift } from "./../../actions/transfer";
import Footer from "./../common/poweredByVolca";

const styles = {
  container: { alignContent: "center" },
  titleContainer: {
    textAlign: "center",
    marginTop: 54,
    marginBottom: 39
  },
  amountContainer: {
    fontSize: 35,
    fontFamily: "SF Display Bold",
    textAlign: "center",
    marginBottom: 38
  },
  amountNumber: { color: "#0099ff" },
  amountSymbol: { color: "#999999" },
  title: {
    fontSize: 24,
    fontFamily: "SF Display Bold"
  },
  numberInput: {
    width: "78%",
    margin: "auto",
    marginBottom: 21
  },
  button: {
    margin: "auto",
    marginTop: 40
  },
  green: "#2bc64f"
};

class ReceiveScreen extends Component {
  constructor(props) {
    super(props);

    const queryParams = qs.parse(props.location.search.substring(1));
    const transitPrivateKey = queryParams.pk;
    this.networkId = queryParams.chainId || queryParams.n || "1";

    this.state = {
      errorMessage: "",
      fetching: true,
      gift: null,
      transitPrivateKey,
      claiming: false
    };
  }

  async componentDidMount() {
    try {
      const gift = await eth2gift.getGift(this.state.transitPrivateKey);
      this.setState({
        fetching: false,
        gift
      });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: "Error occured while getting gift from blockchain!"
      });
    }
  }

  _checkNetwork() {
    if (this.networkId && this.networkId !== this.props.networkId) {
      const networkNeeded = getNetworkNameById(this.networkId);
      const currentNetwork = getNetworkNameById(this.props.networkId);
      const msg = `Transfer is for ${networkNeeded} network, but you are on ${currentNetwork} network`;
      alert(msg);
      throw new Error(msg);
    }
  }

  async _withdrawWithPK() {
    try {
      const { transitPrivateKey, gift } = this.state;
      const result = await this.props.claimGift({ transitPrivateKey, gift });
      this.props.history.push(`/transfers/${result.id}`);
    } catch (err) {
      console.log(err);
      this.setState({
        fetching: false,
        errorMessage: err.message,
        transfer: null
      });
    }
  }

  _onSubmit() {
    // // disabling button
    this.setState({ claiming: true });

    this._withdrawWithPK();
  }

  _renderForm() {
    if (this.state.fetching) {
      return <Loader text="Getting gift" />;
    }

    // if gift was already claimed
    if (this.state.gift.status !== "1") {
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
              Oops!
            </div>
            <div
              style={{
                marginBottom: 55,
                fontFamily: "Inter UI Medium",
                fontSize: 24,
                color: "white",
                textAlign: "left"
              }}
            >
              Link is already claimed
            </div>
          </div>
          <RetinaImage
            className="img-responsive"
            style={{ margin: "auto" }}
            src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/oops.png"
          />
        </Row>
      );
    }
    return (
      <div
        style={{ width: 354, margin: "auto", marginTop: 50, textAlign: "left" }}
      >
        <div
          style={{
            marginBottom: 45,
            fontFamily: "Inter UI Medium",
            fontSize: 30,
            color: "#4CD964",
            textAlign: "left"
          }}
        >
          Your friend
          <br />
          sent you a gift
        </div>
        <RetinaImage
          className="img-responsive"
          style={{ margin: "auto" }}
          src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/letter.png"
        />
        <div style={styles.button}>
          <ButtonPrimary
            handleClick={this._onSubmit.bind(this)}
            disabled={this.state.fetching}
            buttonColor={styles.green}
          >
            {this.state.claiming ? <ButtonLoader /> : "Claim"}
          </ButtonPrimary>
          <SpinnerOrError fetching={false} error={this.state.errorMessage} />
        </div>
      </div>
    );
  }

  render() {
    if (this.state.fetching) {
      return (
        <Loader text="Getting transfer details..." textLeftMarginOffset={-40} />
      );
    }

    if (this.state.errorMessage) {
      return (
        <SpinnerOrError fetching={false} error={this.state.errorMessage} />
      );
    }

    return (
      <Grid>
        <Row>
          <Col sm={4} smOffset={4}>
            {this._renderForm()}
          </Col>
        </Row>
        <div
          style={{
            width: "100%",
            margin: "auto",
            position: "fixed",
            bottom: 0
          }}
        >
          <Footer />
        </div>
      </Grid>
    );
  }
}

export default connect(
  state => ({
    networkId: state.web3Data.networkId,
    receiverAddress: state.web3Data.address
  }),
  { claimGift }
)(ReceiveScreen);
