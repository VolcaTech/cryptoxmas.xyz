import React, { Component } from "react";
import styles from "./styles";

    
const Card = ({card, position}) => { 
    const { cardId, metadata, price } = card;
    return (
	<a style={{ display: "block" }} href={`/#/send/${cardId}`} key={cardId}>
          <div
             style={{
		 ...styles.nftContainer,
            float: position
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
