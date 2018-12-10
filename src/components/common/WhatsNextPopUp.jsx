import React from "react";
import RetinaImage from "react-retina-image";
import styles from "./styles";

const WhatsNextPopUp = ({ handleClick }) => {
  return (
    <div style={{ ...styles.popUpContainer, height: 335 }}>
      <RetinaImage
        className="img-responsive"
        style={{ float: "right", margin: 15 }}
        src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/close.png"
        onClick={handleClick}
      />
      <div style={{ ...styles.popUpTopText, lineHeight: "22px" }}>
        What’s a Nifty token?
        <br />
        <br />
        The picture you received lives on the Ethereum blockchain, as a unique
        token (ERC721).
        <br />
        <br />
        You hold the keys to this token and you can do anything with it:
        <br />
        <br />
        → Send it to another friend
        <br />→{" "}
        <a href="" style={{ color: "black", textDecoration: "underline" }}>
          Sell it on OpenSea
        </a>
        <br />→{" "}
        <a href="" style={{ color: "black", textDecoration: "underline" }}>
          Collect more of them
        </a>
      </div>
    </div>
  );
};

export default WhatsNextPopUp;
