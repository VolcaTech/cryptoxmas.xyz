import React, { Component } from "react";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import web3Service from "./services/web3Service";
import SendScreen from "./components/SendScreen/SendScreen";
import ReceiveForm from "./components/Receive/ReceiveForm";
import TransferComponent from "./components/Transfer";
import Header from "./components/common/Header/Header";
import { Loader } from "./components/common/Spinner";
import HistoryScreen from './components/HistoryScreen/HistoryScreen';
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
import styles from "./styles";


class App extends Component {
  _renderWrongNetwork() {
    return (
      <div>
        <Header />
        <div style={styles.wrongNetworkContainer}>
          <UnsupportedNetwork />
          <Footer />
        </div>
      </div>
    );
  }

  _renderStaticRouter() {
    return (
      <div style={styles.staticRouteContainer}>
        <Header />
        <Router>
          <div style={styles.background}>
            <Switch>
              <Route component={NoWalletScreen} />
            </Switch>
          </div>
        </Router>
        <Footer />
      </div>
    );
  }

  render() {
    if (!this.props.loaded) {
      return (
        <div>
          <Loader instruction="Open your wallet to login" />
        </div>
      );
    }

    if (!this.props.connected || !this.props.address) {
      return this._renderStaticRouter();
    }

      if (!(this.props.networkId === "1" || this.props.networkId === "3" || this.props.networkId === "4")) {
      return this._renderWrongNetwork();
    }

    return (
      <div style={styles.background}>
        <Header />
        <Router>
          <div style={{ height: window.outerHeight }}>
            <Switch>
              <Route
                exact
                path="/transfers/:transferId"
                component={TransferComponent}
		 />
              <Route path="/history" component={HistoryScreen} />	      
              <Route exact path="/send/:cardId" component={SendScreen} />

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
            <Footer />
          </div>
        </Router>
        <Row />
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
