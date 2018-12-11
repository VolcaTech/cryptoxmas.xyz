import React from "react";
import RetinaImage from "react-retina-image";
import styles from "./styles";

const HomeScreenPopUp = ({ handleClick }) => {
  return (
    <div style={{ ...styles.popUpContainer, height: 477 }}>
      <RetinaImage
        className="img-responsive"
        style={{ float: "right", margin: 15 }}
        src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/close.png"
        onClick={handleClick}
      />
      <div style={styles.popUpTopText}>
        You share the Nifty & Ether link just like a text message.
      </div>
      <RetinaImage
        className="img-responsive"
        style={{ margin: "auto", marginTop: 20 }}
        src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/link_example.png"
      />

      <div
        style={{ ...styles.popUpBottomText, lineHeight: "22px", marginTop: 20 }}
      >
        Your friend simply opens the link to claim the Nifty tokens & Ether.
        <br />
        <br />
        In between you and your friend, the Nifty & Ether are securely hold in
        an escrow Smart Contract. Until claimed, you can always claim them back
        yourself.
        <br />
        <br />
        For more details, read{" "}
        <a
          href="https://cryptoxmas.xyz/"
          style={{ textDecoration: "underline", color: "black" }}
        >
          our blog post
        </a>
        , explaining the full process.
      </div>
    </div>
  );
};

export default HomeScreenPopUp;
