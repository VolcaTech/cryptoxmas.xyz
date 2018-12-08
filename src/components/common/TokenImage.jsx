import React from "react";
import RetinaImage from "react-retina-image";
import styles from "./styles";

const TokenImage = ({
  url,
  price = null,
  message = "",
  hidePrice = false,
  name = ""
}) => {
  let shownPrice;
  if (price) {
    shownPrice = price + " ETH";
  }
  if (price && price.toString().length > 10) {
    shownPrice = price.toFixed(3) + " ETH";
  }
  if (!price) {
    shownPrice = "0.05 ETH";
  }

  return (
    <div style={styles.tokenBorder}>
      <div style={styles.tokenPrice}> {!hidePrice ? shownPrice : ""}</div>
      {url ? (
        <div>
          <RetinaImage
            className="img-responsive"
            style={styles.tokenImage}
            src={url}
          />
          <span style={styles.tokenName}>{name}</span>
        </div>
      ) : (
        <div style={styles.message}>{message}</div>
      )}
    </div>
  );
};

export default TokenImage;
