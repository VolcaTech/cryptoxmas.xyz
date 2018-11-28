import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Grid } from 'react-bootstrap';
import * as eth2gift from '../../services/eth2gift';
import ButtonPrimary from './../common/ButtonPrimary';
import { SpinnerOrError, Loader } from './../common/Spinner';
import { getNetworkNameById } from '../../utils';
const qs = require('querystring');
import web3Service from "../../services/web3Service";
import { claimGift } from './../../actions/transfer';


const styles = {
    container: { alignContent: 'center' },
    titleContainer: {
        textAlign: 'center',
        marginTop: 54,
        marginBottom: 39
    },
    amountContainer: {
        fontSize: 35,
        fontFamily: 'SF Display Bold',
        textAlign: 'center',
        marginBottom: 38
    },
    amountNumber: { color: '#0099ff' },
    amountSymbol: { color: '#999999' },
    title: {
        fontSize: 24,
        fontFamily: 'SF Display Bold'
    },
    numberInput: {
        width: '78%',
        margin: 'auto',
        marginBottom: 21
    },
    button: {
        width: '78%',
        margin: 'auto'
    },
    green: '#2bc64f'
}


class ReceiveScreen extends Component {
    constructor(props) {
        super(props);

        const queryParams = qs.parse(props.location.search.substring(1));
        const transitPrivateKey = queryParams.pk;
        this.networkId = queryParams.chainId || queryParams.n || "1";
	
        this.state = {
            errorMessage: "",
            fetching: true,
            gift: null,
            transitPrivateKey,
	    claiming: false
        };
    }

    async componentDidMount() {
	try { 
	    const gift = await eth2gift.getGift(this.state.transitPrivateKey);
	    this.setState({
		fetching: false,
		gift
	    });
	} catch(err) {
	    console.log(err);
	    this.setState({
		errorMessage: "Error occured while getting gift from blockchain!"
		
	    });
	}
    }
    
    
    _checkNetwork() {
        if (this.networkId && this.networkId != this.props.networkId) {
            const networkNeeded = getNetworkNameById(this.networkId);
            const currentNetwork = getNetworkNameById(this.props.networkId);
            const msg = `Transfer is for ${networkNeeded} network, but you are on ${currentNetwork} network`;
	    alert(msg);
            throw new Error(msg);
        }
    }

    async _withdrawWithPK() {
        let result;
        try {
            const { transitPrivateKey, gift } = this.state;
            const result = await this.props.claimGift({transitPrivateKey, gift});
            this.props.history.push(`/transfers/${result.id}`);
        } catch (err) {
	    console.log(err);
            this.setState({ fetching: false, errorMessage: err.message, transfer: null });
        }
    }

 
    _onSubmit() {
        // // disabling button
        this.setState({ fetching: true });

        // // sending request for sms-code
        this._withdrawWithPK();
    }
    
    _renderForm() {

	if (this.state.fetching) {
	    return (<Loader text="Getting gift"/>);
	}


	// if gift was already claimed
	console.log(this.state.gift);
	if (this.state.gift.status !== "1") {
	    return (<div>Gift was already claimed</div>);
	}
	
        return (
	    <div style={{ flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ height: 250 }}>
                <div style={styles.titleContainer}>
                  <span style={styles.title}>Claim Token</span>
                </div>

                <div style={styles.amountContainer}>
                  <span style={styles.amountNumber}>{this.state.gift.amount} </span><span style={styles.amountSymbol}>ETH</span>
                </div>

                <div style={styles.button}>
                  <ButtonPrimary
                     handleClick={this._onSubmit.bind(this)}
                     disabled={this.state.fetching}
                     buttonColor={styles.green}>
                    Confirm
		  </ButtonPrimary>
                </div>

                <SpinnerOrError fetching={this.state.fetching} error={this.state.errorMessage} />

              </div>
	    </div>
        );
    }
    
    render() {
        if (this.state.fetching) {
            return <Loader text="Getting transfer details..." textLeftMarginOffset={-40} />;
        }

	if (this.state.errorMessage) {
            return <SpinnerOrError fetching={false} error={this.state.errorMessage} />;
	}
	
        return (
            <Grid>
              <Row>
                <Col sm={4} smOffset={4}>
		  { this._renderForm() } 
                </Col>
              </Row>
            </Grid>
	    
        );
    }
}


export default connect(state => ({
    networkId: state.web3Data.networkId,
    receiverAddress: state.web3Data.address
}), { claimGift })(ReceiveScreen);
