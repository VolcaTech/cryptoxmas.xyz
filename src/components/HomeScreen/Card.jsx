import React, { Component } from "react";
import styles from "./styles";

    
const Card = ({card, position}) => { 
    const { cardId, metadata, price } = card;
    return (
	<a style={{ display: "block"}} className="no-hover-decoration" href={`/#/send/${cardId}`} key={cardId}>
          <div
             style={{
		 ...styles.nftContainer
             }}
             >
            <span style={styles.nftPrice}>{price} ETH</span>
            <img style={styles.nftImage} src={metadata.image} />
            <div style={styles.nftName}>{metadata.name}</div>
          </div>
	</a>
    );
}

export default Card;
