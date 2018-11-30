import React, { Component } from "react";
import RetinaImage from "react-retina-image";

const styles = {
  border: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: 300,
    height: 300,
    backgroundColor: "white",
    backgroundImage:
      "url(https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/nft_border.png)",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: 280,
    borderRadius: 5,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    marginBottom: 30
  },
  price: {
    textAlign: "right",
    margin: "15px 25px 0px 0px",
    color: "#4CD964",
    fontFamily: "Inter UI Bold",
    fontSize: 20,
    height: 28
  },
  image: {
    margin: "auto",
    marginTop: 0,
    width: 220,
    height: 220
  }
};

const TokenImage = ({ url, price = null }) => {
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
    <div style={styles.border}>
      <div style={styles.price}> {shownPrice}</div>
      {url ? (
        <RetinaImage
          className="img-responsive"
          style={styles.image}
          src={url}
        />
      ) : null}
    </div>
  );
};

export default TokenImage;
