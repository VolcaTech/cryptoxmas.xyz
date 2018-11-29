import React, { Component } from 'react';
import { getEtherscanLink } from './components';
import TransferStepsBar from './../common/TransferStepsBar';
import { HashRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import { parse, format, asYouType } from 'libphonenumber-js';
import { ShareButton } from './components';
import { Row, Col } from 'react-bootstrap';
import RetinaImage from 'react-retina-image';
import Footer from './../common/poweredByVolca'


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



const DepoisitingScreen = ({ transfer }) => {

    const etherscanLink = getEtherscanLink({ txHash: transfer.txHash, networkId: transfer.networkId });

    if (transfer.fetchedFromServer) {
        return (
            <div>
                <div style={styles.stepsBar}>
                    <TransferStepsBar
                        status={transfer.status}
                        direction={transfer.direction}
                        isError={transfer.isError} />
                </div>

                <div className="text-center">
                    <div style={styles.titleContainer}>
                        <div className="title">
                            Sender's transaction<br />
                            is processing...
		  </div>
                    </div>

                    <div style={styles.subTitleContainer}>
                        <div className="text">
                            It may take 1-2 min. Then you can receive Ether.<br />
                            You can close this screen and check the status<br />
                            later  by sender's link
		  </div>
                    </div>

                    <div style={styles.helpContainer}>
                        <div className="text">
                            Transaction details on <a href={etherscanLink} className="link">Etherscan</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div>
            <Row>
                <div style={{ width: 414, margin: 'auto', marginTop: 50, textAlign: 'left' }}>
                    <div style={{ marginBottom: 25, fontFamily: 'Inter UI Medium', fontSize: 30, color: '#4CD964', textAlign: 'left' }}>
                        Magic happens…</div>
                    <div style={{ marginBottom: 40, fontFamily: 'Inter UI Medium', fontSize: 24, color: 'white', textAlign: 'left' }}>Transaction is processing</div>
                    <div style={{ marginBottom: 50, fontFamily: 'Inter UI Regular', fontSize: 18, color: '#8B8B8B', textAlign: 'left' }}>
                        It may take a few minutes. You can<br />check the status later here
            <div style={{ marginTop: 8 }}>Details on <a href={etherscanLink} style={{ textDecoration: 'underline', color: '#8B8B8B', }}> Etherscan</a>
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


export default DepoisitingScreen;
