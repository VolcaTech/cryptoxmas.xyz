import React, { Component } from "react";
import { connect } from "react-redux";
import web3Service from "./services/web3Service";
import SendScreen from "./components/SendScreen/SendScreen";
import ReceiveForm from "./components/Receive/ReceiveForm";
import TransferComponent from "./components/Transfer";
import Header from "./components/common/Header/Header";
import { Loader } from "./components/common/Spinner";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import NoWalletScreen from "./components/NotConnectedScreens/NoWalletScreen/NoWalletScreen";
import UnsupportedNetwork from "./components/NotConnectedScreens/UnsupportedNetwork";
import HomeScreen from "./components/HomeScreen/HomeScreen.jsx";
import Footer from "./components/common/poweredByVolca";

const styles = {
  background: {
    margin: "auto",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: outerHeight,
    backgroundImage:
      "url(https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/sparkles.png)"
  }
};

class App extends Component {
  _renderWrongNetwork() {
    return (
      <div>
        <Header />
        <UnsupportedNetwork />
      </div>
    );
  }

  _renderStaticRouter() {
    return (
      <div style={{ backgroundColor: "#474D5B" }}>
        <Header />
        <Router>
          <div style={styles.background}>
            <Switch>
              <Route component={NoWalletScreen} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </div>
    );
  }

  render() {
    if (!this.props.loaded) {
      return <Loader />;
    }

    if (!this.props.connected || !this.props.address) {
      return this._renderStaticRouter();
    }

    if (this.props.networkId !== "3") {
      return this._renderWrongNetwork();
    }

    return (
      <div style={{ backgroundColor: "#474D5B" }}>
        <Header />
        <Router>
          <div style={styles.background}>
            <Switch>
              <Route
                exact
                path="/transfers/:transferId"
                component={TransferComponent}
              />
              <Route exact path="/send/:tokenId" component={SendScreen} />

              <Route path="/receive" component={ReceiveForm} />
              <Route
                path="/r"
                render={props => {
                  return (
                    <Redirect
                      to={{
                        pathname: "/receive",
                        search: props.location.search
                      }}
                    />
                  );
                }}
              />

              <Route component={HomeScreen} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let balance;
  const web3 = web3Service.getWeb3();
  if (state.web3Data.balance) {
    balance = web3.fromWei(state.web3Data.balance, "ether").toNumber();
  }

  return {
    address: state.web3Data.address,
    balance,
    connected: state.web3Data.connected,
    networkId: state.web3Data.networkId,
    networkName: state.web3Data.networkName,
    loaded: state.web3Data.loaded
  };
}

export default connect(mapStateToProps)(App);
