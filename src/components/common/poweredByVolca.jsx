import React from "react";
import styles from "./styles";

const PoweredByVolca = () => {
  return (
    <div style={styles.footerContainer}>
      <a
        href="https://t.me/CryptoXmas"
        target="_blank"
        style={{ textDecoration: "none" }}
      >
        <div style={styles.footerPowered}>Join our </div>
        <div style={styles.footerVolca}>Telegram group</div>
      </a>
      <div style={styles.footerLinkContainer}>
        <a href="https://cryptoxmas.xyz/privacy.html" style={styles.link}>
          Privacy
        </a>
        <a href="https://cryptoxmas.xyz/terms.html" style={styles.link}>
          Terms
        </a>
      </div>
    </div>
  );
};

export default PoweredByVolca;
