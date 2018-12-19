import React from "react";
import RetinaImage from "react-retina-image";
import styles from "./../common/styles";

const HomeScreenPopUp = ({ handleClick }) => {
  return (
    <div style={{ ...styles.popUpContainer, height: 490 }}>
      <RetinaImage
        className="img-responsive"
        style={{ float: "right", margin: 15 }}
        src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/close.png"
        onClick={handleClick}
      />
      <div
        style={{
          ...styles.popUpTopText,
          color: "#D9544C",
          fontFamily: "Inter UI Bold"
        }}
      >
        1. Christmas Cards
      </div>
      <div style={{ ...styles.popUpTopText, marginTop: 20 }}>
        Send crypto Christmas cards to your friends, simply by sharing a link, like that:
      </div>
      <RetinaImage
        className="img-responsive"
        style={{ margin: "auto", marginTop: 20 }}
        src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/link_example.png"
      />
      <div
        style={{
          ...styles.popUpTopText,
          color: "#D9544C",
          fontFamily: "Inter UI Bold"
        }}
      >
        2. Support Charity
      </div>
      <div
        style={{ ...styles.popUpBottomText, lineHeight: "22px", marginTop: 20 }}
      >
        All donations are distributed to Venezulans in need, via our{" "} 
        <a
          href="https://beta.giveth.io/campaigns/5c0e84ea06392d786b64d484"
          style={{ textDecoration: "underline", color: "black" }}
        >
        Giveth charity campaign.
        </a>
      </div>
      <div
        style={{ ...styles.popUpBottomText, lineHeight: "22px", marginTop: 10 }}
      >
        For more details, read{" "}
        <a
          href="https://medium.com/@cryptoxmas/launching-cryptoxmas-on-mainnet-9dbe107eaac0"
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
