import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
const qs = require('querystring');

import { buyGift } from '../../actions/transfer';
import NumberInput from './../common/NumberInput';
import ButtonPrimary from './../common/ButtonPrimary';
import { Error, ButtonLoader } from './../common/Spinner';
import web3Service from './../../services/web3Service';


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
        fontSize: 13,
        fontFamily: 'SF Display Regular',
        opacity: 0.4,
    },
    betaContainer: {
        paddingTop: 8,
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
            amount: 0,
            errorMessage: "",
            fetching: false,
            buttonDisabled: false,
            checked: false,
            checkboxTextColor: '#000',
            numberInputError: false,
            phoneError: false,
            phoneOrLinkActive: false,
	    tokenId
        };
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
        const { sendMode } = this.props;
        let phoneInputStyle;
        return (
            <Row>
                <Col sm={4} smOffset={4}>

                    <div>                      
                        <div style={styles.container}>
                         
                            <div style={styles.numberInput}>
                                <NumberInput
                                    onChange={({ target }) => (this.setState({ amount: target.value, numberInputError: false, errorMessage: "" })
                                    )}
                                    disabled={false}
                                    fontColor='#000000'
                                    backgroundColor='#fff'
                                    style={{ touchInput: 'manipulation' }}
                                    placeholder="ETH amount"
                                    error={this.state.numberInputError}
                                />
                            </div>

                            <div style={styles.sendButton}>
                                <ButtonPrimary
                                    handleClick={ this._onSubmit.bind(this) }
                                    buttonColor={this.state.fetching ? styles.blueOpacity : styles.blue}
                                    disabled={this.state.buttonDisabled}>
                                    {this.state.fetching ? <ButtonLoader /> : "Send"}

                                </ButtonPrimary>

                                {(this.state.fetching || this.state.errorMessage) ? (<Error
                                    fetching={this.state.fetching}
                                    error={this.state.errorMessage} />) :
                                    <div style={styles.betaContainer}>
                                        <span style={styles.betaText}>
                                            *In beta you can send
				 <span style={styles.betaBold}> 1 ETH</span> max
				 </span>
                                    </div>}
                            </div>
                        </div>
                    </div>
                </Col>
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
