import React from "react";
import RetinaImage from "react-retina-image";
import styles from "./styles";

const TokenImage = ({ url, price = null, message = "", hidePrice = false, name = "" }) => {
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
        <span style={{display: "block", textAlign: "center", fontFamily: "Inter UI Bold", fontSize: 18}}>{name}</span>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "auto",
            marginTop: -10,
            height: 230,
            width: 240,
            fontFamily: "Inter UI Medium",
            fontSize: 24,
            textAlign: "center"
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default TokenImage;
