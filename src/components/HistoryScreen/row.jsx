import React from "react";
import styles from './styles';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Row, Col, Button, Grid } from 'react-bootstrap';
import mintedTokensJson from "../../../cryptoxmas-contracts/scripts/deployed/mintedTokens.json";
import { getNetworkNameById } from "../../utils";

const StatusCell = ({ transfer }) => {
    if (transfer.isError) {
        return (
	    <div style={styles.statusCell.container}>
	      <div style={{ ...styles.statusCell.statusText, color: '#f04234' }}>Failed</div>
	    </div>
	);
    }

    switch (transfer.status) {
    case "depositing":
	return (
	    <div style={styles.statusCell.container}>
	      <div style={styles.statusCell.statusText}>Buying...</div>
	    </div>
	);
	break;	
    case "deposited":
	//<CancelButton transfer={transfer} cancelTransfer={cancelTransfer} />	
	return (
	    <div style={styles.statusCell.container}>
	      <div style={{ ...styles.statusCell.statusText }}>Not claimed</div>    	      
	    </div>
	);
	break;
    case "sent":
	return (
	    <div style={styles.statusCell.container}>
	      <div style={{...styles.statusCell.statusText, color: '#4CD964'}}>Claimed</div>
	    </div>
	);
	break;
    case "receiving":
	return (
	    <div style={styles.statusCell.container}>
	      <div style={styles.statusCell.statusText}>Claiming...</div>
	    </div>
	);
	break;
    case "received":
	return (
	    <div style={styles.statusCell.container}>
	      <div style={{ ...styles.statusCell.statusText, color: '#4CD964' }}>Received</div>
	    </div>
	);
	break;
    case "cancelling":
	return (
	    <div style={styles.statusCell.container}>
	      <div style={styles.statusCell.pendingStatusText}>Canceling...</div>

            </div>
	);
	break;
    case "cancelled":
	return (
	    <div style={styles.statusCell.container}>
	      <div style={{ ...styles.statusCell.statusText }}>Canceled</div>

            </div>
	);
	break;
    default:
	return (
	    <div style={styles.statusCell.container}>
	      <div style={styles.statusCell.pendingStatusText}>{transfer.status}</div>
	    </div>
	);
    }

}


// const CancelButton = ({ transfer, cancelTransfer }) => {
//     return (
//         <Button className="cancel-button" onClick={async () => {
// 	      var r = confirm("Are you sure you want to cancel transfer?");
// 	      if (r) {
// 		  await cancelTransfer(transfer);
// 	      }
// 	  }}>
// 	  Cancel
// 	</Button>
//     );
// }



const HistoryRow = ({ transfer, address, networkId }) => {
    let link = (<Link
		to={`/transfers/${transfer.id}`}
		style={{}}
		className="no-underline"
		><span style={styles.statusCell.infoIcon}>i</span></Link>);
    const network = getNetworkNameById(networkId).toLowerCase();    
    const cardName = ((transfer.cardId && mintedTokensJson[network][transfer.cardId].metadata.name) ||
		      transfer.gift.name);
    // <div style={{color: 'white', display: 'inline'}}>{ transfer.amount ? ` + ${transfer.amount} ETH` : null }</div>

    return (
	<div>
	  <Row style={{marginBottom: 15}}>
	    <Col style={styles.colVertAlign} xs={7}>
	      <div style={styles.amount}><img src={address === transfer.senderAddress ? "https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/arrow_out.png" : "https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/arrow_in.png"} style={styles.directionIcon}></img>
	        <div style={styles.transfer}>{cardName}</div>
	      </div>     
	    </Col>
            <Col style={styles.colVertAlign} xs={5}>
	      <div style={{ display: 'flex', flexDirection: 'row', }}>
		<StatusCell transfer={transfer} />
		<div style={{ display: 'inline', marginLeft: 'auto' }}>
		  {link}
		</div>
	      </div>
	    </Col>
	  </Row>
	</div>
    )
}


export default HistoryRow;
