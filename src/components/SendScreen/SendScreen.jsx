import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
const qs = require('querystring');
import Footer from './../common/poweredByVolca'
import { buyGift } from '../../actions/transfer';
import NumberInput from './../common/NumberInput';
import ButtonPrimary from './../common/ButtonPrimary';
import { Error, ButtonLoader } from './../common/Spinner';
import web3Service from './../../services/web3Service';
import RetinaImage from 'react-retina-image';



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
            // <Row>
            //     <Col sm={4} smOffset={4}>

            //         <div>                      
            //             <div style={styles.container}>



                            
            //             </div>
            //         </div>
            //     </Col>
            // </Row>
            <Row>
                <div style={{ width: 354, margin: 'auto', marginTop: 50, textAlign: 'left' }}>
                    <div style={{ marginBottom: 25, fontFamily: 'Inter UI Medium', fontSize: 30, color: '#4CD964', textAlign: 'left' }}>
                    Buy a Nifty and create<br/>your gift link!</div>
                    <div style={{ marginBottom: 40, fontFamily: 'Inter UI Medium', fontSize: 24, color: 'white', textAlign: 'left' }}>Buy a Nifty and create your gift link!</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', margin: 'auto', width: 300, height: 300, backgroundColor: 'white', backgroundImage: "url(https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/nft_border.png)", backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 280, borderRadius: 5, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', marginBottom: 30 }}>
                    <div style={{ textAlign: 'right', margin: '15px 25px 0px 0px', color: '#4CD964', fontFamily: 'Inter UI Bold', fontSize: 20 }}>0.05 ETH</div>
                    <RetinaImage className="img-responsive" style={{ margin: 'auto', marginTop: 0, width: 220, }} src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/santa_zombie@3x.png" />
                    {/* <div style={{ textAlign: 'center', color: 'black', fontFamily: 'Inter UI Bold', fontSize: 14 }}>{metadata.name}</div> */}
                </div>
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
