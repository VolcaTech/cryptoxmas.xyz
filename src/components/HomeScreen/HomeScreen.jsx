import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { buyGift } from "../../actions/transfer";
import { Loader } from "./../common/Spinner";
import cryptoxmasService from "./../../services/cryptoxmasService";
import styles from "./styles";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      fetching: true,
      tokens: []
    };
  }

  async componentDidMount() {
    const tokens = await cryptoxmasService.getGiftsForSale();
    this.setState({ fetching: false, tokens });
  }

  _renderToken(token, position) {
    const { tokenId, metadata } = token;
    return (
      <a style={{ display: "block" }} href={`/#/send/${tokenId}`} key={tokenId}>
        <div
          style={{
            ...styles.nftContainer,
            float: position
          }}
        >
          <span style={styles.nftPrice}>0.05 ETH</span>
          <img style={styles.nftImage} src={metadata.image} />
          <div style={styles.nftName}>{metadata.name}</div>
        </div>
      </a>
    );
  }

  render() {
    const column1 = this.state.tokens.filter((token, index) => index % 2 === 0);
    const column2 = this.state.tokens.filter((token, index) => index % 2 !== 0);
    return (
      <Col xs={12} style={{ paddingBottom: 30 }}>
        <Row>
          <div
            style={{
              height: window.innerHeight,
              ...styles.homescreenContainer
            }}
          >
            <div style={styles.homescreenTextContainer}>
              <div style={styles.homescreenGreenTitle}>
                Surprise your friend
                <br />
                with a Nifty & send
                <br />
                some Ether to charity
              </div>
              <div style={styles.homescreenGreyText}>
                *receiver doesn’t need a<br /> crypto wallet
              </div>
              <div style={styles.homescreenWhiteTitle}>
                First, choose a Nifty
              </div>
            </div>
            <Col xs={6} sm={6} lg={6} style={styles.nftLeftColumn}>
              {this.state.fetching || this.state.errorMessage ? (
                <Loader text="Getting tokens" />
              ) : (
                <div>{column1.map(t => this._renderToken(t, "right"))}</div>
              )}
            </Col>
            <Col xs={6} sm={6} lg={6} style={styles.nftRightColumn}>
              {this.state.fetching || this.state.errorMessage ? (
                <Loader text="Getting tokens" />
              ) : (
                <div>{column2.map(t => this._renderToken(t, "left"))}</div>
              )}
            </Col>
          </div>
        </Row>
      </Col>
    );
  }
}

export default connect(
  state => ({
    networkId: state.web3Data.networkId,
    balanceUnformatted: state.web3Data.balance
  }),
  { buyGift }
)(HomeScreen);
