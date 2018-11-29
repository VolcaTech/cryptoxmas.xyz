import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
const qs = require('querystring');
import Footer from './../common/poweredByVolca';
import TokenImage from './../common/TokenImage';
import { buyGift } from '../../actions/transfer';
import NumberInput from './../common/NumberInput';
import ButtonPrimary from './../common/ButtonPrimary';
import { Error, ButtonLoader } from './../common/Spinner';
import web3Service from './../../services/web3Service';
import * as eth2gift from '../../services/eth2gift';


const styles = {
    title: {
        width: '90%',
        height: 110,
        display: 'block',
        margin: 'auto',
        fontSize: 24,
        lineHeight: 1.4,
        fontFamily: 'SF Display Black',
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 27
    },
    text1: {
        width: '85%',
        height: 68,
        display: 'block',
        margin: 'auto',
        fontSize: 15,
        lineHeight: '17px',
        fontFamily: 'SF Display Regular',
        textAlign: 'center',
        marginBottom: 36
    },
    container: {
        display: 'flex',
        margin: 'auto',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    numberInput: {
        display: 'block',
        margin: 'auto',
        width: '78%',
        height: 39,
        marginBottom: 19,
        marginTop: 19
    },
    sendButton: {
        width: '78%',
        display: 'block',
        margin: 'auto'
    },
    spinner: {
        height: 28,
        textAlign: 'center',
        marginTop: 10
    },
    betaText: {
        fontSize: 14,
        fontFamily: 'Inter UI Regular',
        color: '#8B8B8B'
    },
    betaContainer: {
        paddingTop: 15,
        marginBottom: 50,
        height: 28,
        textAlign: 'center',
    },
    betaBold: {
        fontFamily: 'SF Display Bold'
    },
    blue: '#0099ff',
    blueOpacity: '#80ccff',
    hiddenInput: {
        height: 0,
        overflow: 'hidden'
    }
}


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
            checkboxTextColor: '#000',
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
	} catch(err) {
	    console.log(err);
	    this.setState({
		errorMessage: "Error occured while getting token from blockchain!"
	    });
	}	
    }
    
    async _buyGift() {
        try {
            console.log("on buy Gift")
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
        console.log("onSubmit")
        const web3 = web3Service.getWeb3();
        if (this.props.balanceUnformatted) {
            balance = web3.fromWei(this.props.balanceUnformatted, 'ether').toNumber();
        }

        // check amount
        if (this.state.amount <= 0) {
            this.setState({ fetching: false, errorMessage: "Amount should be more than 0", numberInputError: true });
            return;
        };

        // check amount maximum
        if (this.state.amount > 1) {
            this.setState({ fetching: false, errorMessage: (<span>*In beta you can send <span style={styles.betaBold}>1 ETH</span> max.</span>), numberInputError: true });
            return;
        };

        // check wallet has enough ether
        if (this.state.amount > balance) {
            this.setState({ fetching: false, errorMessage: "Not enough ETH on your balance", numberInputError: true });
            return;
        };

        // check if checkbox is submitted
        // if (this.state.checked === false) {
        //     this.setState({ buttonDisabled: true, checkboxTextColor: '#e64437' })
        //     return;
        // }

        // disabling button
        this.setState({ fetching: true });

        // sending transfer
        setTimeout(() => {  // let ui update
            this._buyGift()
        }, 100);
    };


    _renderForm() {
        return (
            <Row>
                <div style={{ width: 354, margin: 'auto', marginTop: 50, textAlign: 'left' }}>
                    <div style={{ marginBottom: 25, fontFamily: 'Inter UI Medium', fontSize: 30, color: '#4CD964', textAlign: 'left' }}>
                    Pack your gift</div>
                    <div style={{ marginBottom: 40, fontFamily: 'Inter UI Medium', fontSize: 24, color: 'white', textAlign: 'left' }}>Buy a Nifty and create your gift link!</div>
                </div>
		<TokenImage price={this.state.amount} url={this.state.token.image || ""} />
                <div style={styles.sendButton}>
                                <ButtonPrimary
                                    handleClick={ this._onSubmit.bind(this) }
                                    >
                                    {this.state.fetching ? <ButtonLoader /> : "Buy & Send"}

                                </ButtonPrimary>

                                {(this.state.fetching || this.state.errorMessage) ? (<Error
                                    fetching={this.state.fetching}
                                    error={this.state.errorMessage} />) :
                                    <div style={styles.betaContainer}>
                                        <span style={styles.betaText}>
                                        You will get a simple link, sendable<br/>via any messenger
            	 </span>
                                    </div>}
                            </div>
                    <Footer/>
            </Row>

        );
    }

    render() {
        return (
            <div>
                {this._renderForm()}
            </div>
        );
    }
}


export default connect(state => ({
    networkId: state.web3Data.networkId,
    balanceUnformatted: state.web3Data.balance
}), { buyGift })(SendScreen);
