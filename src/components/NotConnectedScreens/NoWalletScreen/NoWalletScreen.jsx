import React, { Component } from "react";
import RetinaImage from "react-retina-image";
const qs = require("querystring");
import styles from "./../styles";
import wallets from "./wallets";
import { getDeviceOS } from "../../../utils";
import WalletSlider from "./WalletSlider";

class NoWalletScreen extends Component {
  constructor(props) {
    super(props);

    let selectedWallet;
    const queryParams = qs.parse(props.location.search.substring(1));

    // parse url params
    const walletFromLink = queryParams.wallet || queryParams.w;

    // select Trust Wallet by default
    selectedWallet = wallets.trust;

    // if there is valid wallet id in url
    if (walletFromLink && wallets[walletFromLink]) {
      const wallet = wallets[walletFromLink];
      const os = getDeviceOS();

      // if wallet from the url is supported by devices OS
      if (wallet.mobile[os] && wallet.mobile[os].support === true) {
        selectedWallet = wallet;
      }
    }

    this.state = {
      selectedWallet,
      disabled: true,
      showCarousel: false,
      showInstruction: false
    };
  }

  _getDeepLink() {
    //const dappUrl = encodeURIComponent(window.location);
    const dappUrl = String(window.location);
    const wallet = this.state.selectedWallet;
    const os = getDeviceOS();

    // if wallet is supported by devices OS
    if (
      !(
        wallet.mobile[os] &&
        wallet.mobile[os].support === true &&
        wallet.mobile[os].deepLink !== null
      )
    ) {
      return { link: wallet.walletURL, isDeepLink: false };
    }

    return { link: wallet.mobile[os].deepLink(dappUrl), isDeepLink: true };
  }

  _selectWallet(walletName) {
    const wallet = wallets[walletName];
    this.setState({
      selectedWallet: wallet,
      showCarousel: false
    });
  }

  _renderForMobile() {
    const { link, isDeepLink } = this._getDeepLink();

    // if there is deep link for the wallet for the device OS
    if (isDeepLink) {
      return this._renderWithDeepLink(link);
    }

    // if there is NO deep link
    return this._renderWithoutDeepLink(link);
  }

  _renderWithDeepLink(deepLink) {
    return (
      <div style={styles.screenContainer}>
        <div style={styles.greenTitle}>
          Your friend
          <br />
          sent you a gift
        </div>
        <RetinaImage
          className="img-responsive"
          style={{ margin: "auto" }}
          src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/letter.png"
        />
        <a
          href={deepLink}
          style={{ ...styles.noWalletScreenButton, marginTop: 40 }}
          target="_blank"
        >
          {" "}
          Open in {this.state.selectedWallet.name}{" "}
        </a>
        <WalletSlider
          selectWallet={this._selectWallet.bind(this)}
          selectedWallet={this.state.selectedWallet}
        />
        :
      </div>
    );
  }

  _renderWithoutDeepLink(link) {
    const walletIcon = `https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/${
      this.state.selectedWallet.id
    }.png`;

    // #TODO add this screen
    return (
      <div style={styles.screenContainer}>
        <div style={styles.greenTitle}>
          How to use
          <br />
          {this.state.selectedWallet.name}
        </div>
        <div>
          <img src={walletIcon} style={styles.largeWalletIcon} />
        </div>
        <Instructions wallet={this.state.selectedWallet} />
        <WalletSlider
          selectWallet={this._selectWallet.bind(this)}
          selectedWallet={this.state.selectedWallet}
        />
      </div>
    );
  }

  _renderForDesktop() {
    return (
      <div style={styles.screenContainer}>
        <div style={styles.greenTitle}>
          You need Metamask to
          <br />
          send or receive gifts
        </div>
        <RetinaImage
          className="img-responsive"
          style={{ margin: "auto" }}
          src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/letter.png"
        />
        <a
          href={"https://metamask.io/"}
          style={{ ...styles.noWalletScreenButton, marginTop: 40 }}
          target="_blank"
        >
          {" "}
          Install Metamask{" "}
        </a>
      </div>
    );
  }

  render() {
    return window.innerWidth < 769
      ? this._renderForMobile()
      : this._renderForDesktop();
  }
}

const Instructions = ({ wallet }) => {
  const walletId = wallet.id;
  return (
    <div style={styles.noWalletInstructionContainer}>
      <div style={styles.noWalletInstructionText}>
        {" "}
        1. Download/Open{" "}
        <a
          href={wallets[walletId].walletURL}
          style={{
            ...styles.noWalletInstructionText,
            textDecoration: "underline"
          }}
        >
          {wallet.name}
        </a>
      </div>
      <div style={styles.noWalletInstructionText}>
        {" "}
        2. Create new or import existing wallet{" "}
      </div>
      <div style={styles.noWalletInstructionText}>
        {" "}
        3. Open the gift link in a DApp browser and follow simple instructions{" "}
      </div>
    </div>
  );
};

export default NoWalletScreen;
