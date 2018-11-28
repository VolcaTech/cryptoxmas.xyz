import React, { Component } from 'react';
import { connect } from 'react-redux';
import Web3StatusBar from './components/common/Web3StatusBar';
import web3Service from './services/web3Service';
import SendScreen from './components/SendScreen/SendScreen';
import ReceiveForm from './components/Receive/ReceiveForm';
import TransferComponent from './components/Transfer';
import NoWalletHeader from './components/common/NoWalletHeader';
import { Loader } from './components/common/Spinner';
import { HashRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import NoWalletScreen from './components/NotConnectedScreens/NoWalletScreen/NoWalletScreen';
import UnsupportedNetwork from './components/NotConnectedScreens/UnsupportedNetwork';
import HomeScreen from './components/HomeScreen/HomeScreen.jsx';


class App extends Component {
    _renderWrongNetwork() {
        return (
            <div>
                <NoWalletHeader />
                <UnsupportedNetwork />
            </div>
        );
    }

    _renderStaticRouter() {
        return (
            <Router>
                <div>
                    <NoWalletHeader />
                    <Switch>
                        <Route component={NoWalletScreen} />			
                    </Switch>
                </div>
            </Router>
        );
    }

    render() {
        if (!this.props.loaded) {
            return (<Loader />);
        }

        if (!this.props.connected || !this.props.address) {
            return this._renderStaticRouter();
        }

        if (this.props.networkId != "3"
	    // && this.props.networkId != "1"
	   ) {
            return this._renderWrongNetwork();
        }

        return (
            <Router>
                <div>

                    <Switch>
                        <Route exact path="/transfers/:transferId" component={TransferComponent} />
                        <Route exact path='/send/:tokenId' component={SendScreen}/>

                        <Route path="/receive" component={ReceiveForm} />
                        <Route path='/r' render={(props) => {
                            return (
                                <Redirect to={{
                                    pathname: '/receive',
                                    search: props.location.search
                                }} />
                            );
                        }} />

                        <Route component={HomeScreen} />
                    </Switch>

                </div>
            </Router>

        );
    }
}


function mapStateToProps(state) {
    let balance, contractAddress;
    const web3 = web3Service.getWeb3();
    if (state.web3Data.balance) {
        balance = web3.fromWei(state.web3Data.balance, 'ether').toNumber();
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
