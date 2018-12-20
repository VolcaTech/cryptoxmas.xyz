import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import cryptoxmasService from "./../../services/cryptoxmasService";
import styles from "./styles";
import TitleAndDescription from "./TitleAndDescription";
import Card from "./Card";

const CardGroup = ({ group }) => {
  const cards = cryptoxmasService.getCardsForSale();
  const groupCards = cards.filter(card => card.group === group);

  // for small devices i
  const colsXs = window.innerWidth < 375 ? 12 : 6;

  return (
    <Col xs={12} style={{ marginBottom: 50 }}>
      <div style={styles.groupTitle}>{group}</div>
      <Row>
        {" "}
        {groupCards.map(card => (
          <Col xs={colsXs} sm={3} key={card.cardId} style={{ padding: 0 }}>
            <Card card={card} position={"right"} />
          </Col>
        ))}
      </Row>
    </Col>
  );
};

class HomeScreen extends Component {
  render() {
    return (
      <Col xs={12} style={{ paddingBottom: 30 }}>
        <Row>
          <div style={styles.homescreenContainer}>
            <div style={styles.homescreenContent}>
              <TitleAndDescription />
              <CardGroup group="Christmas Mascots" />
              <CardGroup group="Christmas Spirit" />
              <CardGroup group="Raiden" />
              <CardGroup group="Centrifuge" />
              <CardGroup group="MetaCartel" />
              <CardGroup group="imToken" />
              <CardGroup group="GitCoin" />
              <CardGroup group="resurREKT" />	
              <CardGroup group="Giveth" />
	
              <CardGroup group="Naughty or Nice" />
              <CardGroup group="Nervos" />
              <CardGroup group="Gnosis" />	      	      	      	            
            </div>	    
          </div>
        </Row>
      </Col>
    );
  }
}

export default HomeScreen;
