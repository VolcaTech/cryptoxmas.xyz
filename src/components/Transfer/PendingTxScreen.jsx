import React, { Component } from 'react';
import { getEtherscanLink } from './components';
import TransferStepsBar from './../common/TransferStepsBar';
import { HashRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import { ShareButton } from './components';
import { Row, Col } from 'react-bootstrap';
import RetinaImage from 'react-retina-image';
import Footer from './../common/poweredByVolca';


const styles = {
    titleContainer: {
        marginTop: 30,
        marginBottom: 12
    },
    subTitleContainer: {
        margin: 'auto',
    },
    helpContainer: {
        marginTop: 27
    },
    stepsBar: {
        marginTop: 20
    },
    instructionsText: {
        lineHeight: '22px',
        color: '#000000',
        fontFamily: 'SF Display Bold',
        fontSize: 16,
        fontWeight: 700,
        marginBottom: 15,
        marginTop: 30
    },
    greenBold: {
        color: '#2bc64f',
        fontFamily: 'SF Display Bold'
    }
}



const PendingTxScreen = ({ transfer }) => {

    const etherscanLink = getEtherscanLink({ txHash: transfer.txHash, networkId: transfer.networkId });

    return (
        <div>
            <Row>
                <div style={{ width: 354, margin: 'auto', marginTop: 50, textAlign: 'left' }}>
                    <div style={{ marginBottom: 25, fontFamily: 'Inter UI Medium', fontSize: 30, color: '#4CD964', textAlign: 'left' }}>
                        Magic happens…</div>
                    <div style={{ marginBottom: 40, fontFamily: 'Inter UI Medium', fontSize: 24, color: 'white', textAlign: 'left' }}>Transaction is processing</div>
                    <div style={{ marginBottom: 50, fontFamily: 'Inter UI Regular', fontSize: 18, color: '#8B8B8B', textAlign: 'left' }}>
                        It may take a few minutes. You can<br />check the status later here
            <div style={{ marginTop: 8 }}>Details on <a target="_blank" href={etherscanLink} style={{ textDecoration: 'underline', color: '#8B8B8B', }}> Etherscan</a>
                        </div>
                    </div>
                </div>

            </Row>
            <div style={{ width: '100%', bottom: 0, position: 'fixed' }}>
                <Footer />
            </div>
        </div>

    );
}


export default PendingTxScreen;