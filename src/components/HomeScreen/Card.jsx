import React from "react";
import styles from "./styles";

const Card = ({ card }) => {
  const { cardId, metadata, price } = card;
  const rarity = card.categoryName;
  return (
    <a
      style={{ display: "block" }}
      className="no-hover-decoration"
      href={`/#/send/${cardId}`}
      key={cardId}
    >
      <div
        style={{
          ...styles.nftContainer
        }}
      >
        <div style={styles.nftPriceContainer}>
          {rarity ? <div style={styles.nftRarity}>{rarity}</div> : null}
          <span style={styles.nftPrice}>{price} ETH</span>
        </div>
        <img style={styles.nftImage} src={metadata.image} />
        <div style={styles.nftName}>{metadata.name}</div>
      </div>
    </a>
  );
};

export default Card;
