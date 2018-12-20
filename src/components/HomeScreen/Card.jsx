import React from "react";
import styles from "./styles";

const Card = ({ card }) => {
  const { cardId, metadata, price } = card;
    const rarity = card.categoryName;
    const badgeColor = rarity === 'Unique' ?  { backgroundColor: "#8B8B8B", color: "#fff" } : { backgroundColor: "#fff", color: "#8B8B8B" };
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
          {rarity ? <div style={{...styles.nftRarity, ...badgeColor}}>{rarity}</div> : null}
          <span style={styles.nftPrice}>{price} ETH</span>
        </div>
        <img style={styles.nftImage} src={metadata.image} />
        <div style={styles.nftName}>{metadata.name}</div>
      </div>
    </a>
  );
};

export default Card;
