import React, { Component } from 'react';
import { getEtherscanLink } from './components';
import TransferStepsBar from './../common/TransferStepsBar';
import { HashRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import { ShareButton } from './components';


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



const DepoisitingScreen = ({transfer}) => {

    const etherscanLink = getEtherscanLink({txHash: transfer.txHash, networkId: transfer.networkId});

    return (
	<div>
	  <div style={styles.stepsBar}>
            <TransferStepsBar
	       status={transfer.status}
	       direction={transfer.direction}
	       isError={transfer.isError}/>
	  </div>
	  
	  <div className="text-center">
	    <div style={styles.titleContainer}>
	      <div className="title">
		Depositing Ether…
	      </div>	      
	    </div>

	    <div style={styles.subTitleContainer}>
	      <div className="text">
		It may take 1-2 min. You can close the screen<br/>
		and check the status later in "Transfers"<br/>
	      </div>
	    </div>
	    
	    <div style={styles.helpContainer} className="hidden-xs">
	      <div className="text">Transaction details on <a href={etherscanLink} className="link">Etherscan</a> 
	      </div>	      
	    </div>
	    

	    
	  </div>
	</div>
    );
}


export default DepoisitingScreen;
