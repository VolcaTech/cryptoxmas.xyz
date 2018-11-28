import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
const qs = require('querystring');

import { buyGift } from '../../actions/transfer';
import NumberInput from './../common/NumberInput';
import ButtonPrimary from './../common/ButtonPrimary';
import { Error, ButtonLoader, Loader } from './../common/Spinner';
import web3Service from './../../services/web3Service';
import * as eth2gift from './../../services/eth2gift';

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
	const tokens = await eth2gift.getGiftsForSale();	
	this.setState({ fetching: false, tokens });
    }

    _renderToken(tokenId) {
	return (
	    <div key={tokenId}>
	      <a href={`/#/send/${tokenId}`}>
		<div>Token #{tokenId}</div>
		<img className="img-responsive" src="https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thebostoncalendar.com%2Fsystem%2Fevents%2Fphotos%2F000%2F004%2F859%2Foriginal%2Fsanta.jpg%3F1443855983&f=1"/>
	      </a>
	    </div>
	);
    }

    render() {
        return (
            <Row>
                <Col sm={4} smOffset={4}>

                    <div>                      
                        <div style={styles.container}>
                         
                           <h3> Buy Santa! </h3>

                            <div>
                                {(this.state.fetching || this.state.errorMessage) ? (<Loader text="Getting tokens" />) :
                                 <div>
				 { this.state.tokens.map(t => this._renderToken(t)) }
                                 </div>

				}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

        );
    }
}


export default connect(state => ({
    networkId: state.web3Data.networkId,
    balanceUnformatted: state.web3Data.balance
}), { buyGift })(HomeScreen);
