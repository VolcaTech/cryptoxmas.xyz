import React from "react";
import styles from "./styles";

const Card = ({ card }) => {
  console.log(card);
  const { cardId, metadata, price } = card;
  const rarity = card.categoryName;
  let color;
  switch (rarity) {
    case "Special":
      color = "#c1d94c";
      break;
    case "Rare":
      color = "#4CD964";
      break;
    case "Scarce":
      color = "#644cd9";
      break;
    case "Limited":
      color = "#ab4cd9";
      break;
    case "Epic":
      color = "#d9ab4c";
      break;
    default:
      color = "#4CD964";
  }

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
          {rarity ? (
            <div style={{ ...styles.nftRarity, backgroundColor: color }}>
              {rarity}
            </div>
          ) : null}
          <span style={styles.nftPrice}>{price} ETH</span>
        </div>
        <img style={styles.nftImage} src={metadata.image} />
        <div style={styles.nftName}>{metadata.name}</div>
      </div>
    </a>
  );
};

export default Card;
