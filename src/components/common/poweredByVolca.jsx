import React from "react";
import styles from "./styles";

const PoweredByVolca = () => {
  return (
    <div style={styles.footerContainer}>
      <a href="https://t.me/CryptoXmas" target="_blank" style={{ textDecoration: "none" }}>
        <div style={styles.footerPowered}>Join our </div>
        <div style={styles.footerVolca}>Telegram group</div>
      </a>
    </div>
  );
};

export default PoweredByVolca;
