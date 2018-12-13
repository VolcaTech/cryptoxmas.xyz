import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { buyGift } from "../../actions/transfer";
import cryptoxmasService from "./../../services/cryptoxmasService";
import styles from "./styles";
import TitleAndDescription from './TitleAndDescription';
import Card from './Card';


const CardGroup = ({group}) => {
    const cards = cryptoxmasService.getCardsForSale();
    const column1 = cards.filter((card, index) => index % 2 === 0);
    const column2 = cards.filter((card, index) => index % 2 !== 0);
    
    return (
	<div>
          <div
	     style={styles.groupTitle}
           >
          Christmas Mascots
        </div>          
        <Col xs={6} sm={6} lg={6} style={styles.nftLeftColumn}>
          <div>{column1.map(card => <Card card={card} position={"right"} key={card.cardId} />)}</div>
            </Col>
            <Col xs={6} sm={6} lg={6} style={styles.nftRightColumn}>
            <div>{column2.map(card => <Card card={card} position={"left"} key={card.cardId}/>)}</div>
            </Col>
	</div>
    );
}


class HomeScreen extends Component {


  render() {
    return (
      <Col xs={12} style={{ paddingBottom: 30 }}>
        <Row>
	  <div style={{
		   height: window.innerHeight
               }}>	  
	    <TitleAndDescription/>

	    <CardGroup group="Christmas Mascots"/>
	    
	    </div>
        </Row>
      </Col>
    );
  }
}

export default connect(
  state => ({
    networkId: state.web3Data.networkId,
    balanceUnformatted: state.web3Data.balance
  }),
  { buyGift }
)(HomeScreen);
