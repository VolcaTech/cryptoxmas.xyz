import React from "react";
import { connect } from 'react-redux';
import { getTransfersForActiveAddress } from './../../data/selectors';
import HistoryRow from './row';
import { Row, Col } from 'react-bootstrap';
import RetinaImage from 'react-retina-image';

const styles = {
    screen: { minHeight: 600, paddingTop: 50 },
    transfers: { fontSize: 24, fontFamily: 'SF Display Black', marginBottom: 30, color: 'white' },
    noTransfersContainer: {textAlign: 'center', marginTop: 100},
    illustration: {width: 'unset', marginBottom: 10},
    illustrationText: {fontSize: 24, fontFamily: 'SF Display Bold', color: 'white'}
}


class HistoryScreen extends React.Component {

    _renderRows() {
	return (
	    <Col sm={12} style={{paddingLeft:0}}>
	    {
		this.props.transfers.map(transfer => <HistoryRow transfer={transfer}
					 networkId={this.props.networkId}
					 key={transfer.id}
					 address={this.props.address} /> )
	    }
	    </Col>
	);
    }

    _renderEmptyHistory() {
	return (
	    <div style={styles.noTransfersContainer}>
	      <div style={styles.illustrationText}>No cards sent or received yet</div>
	    </div>
	);
    }
    
    render() {

	return (
	    <div style={styles.screen}>
	      <Col sm={4} smOffset={4}>
		<div style={styles.transfers}>Gifts History</div>
	      </Col>
	      <Col sm={4} smOffset={4} style={{padding:0}}>

		{this.props.transfers.length === 0 ? this._renderEmptyHistory()  :  this._renderRows()}
	      </Col>
	    </div>
	);
    }
}


function mapStateToProps(state) {
    return {
        transfers: getTransfersForActiveAddress(state),
	address: state.web3Data.address,
	networkId: state.web3Data.networkId
    };
}


export default connect(mapStateToProps)(HistoryScreen);
