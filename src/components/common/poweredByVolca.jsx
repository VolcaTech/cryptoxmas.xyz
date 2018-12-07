import React from "react";
import styles from "./styles";

const PoweredByVolca = () => {
  return (
    <div style={styles.footerContainer}>
      <a href="https://volca.tech" style={{ textDecoration: "none" }}>
        <div style={styles.footerPowered}>Powered by </div>
        <div style={styles.footerVolca}>Volcà</div>
      </a>
    </div>
  );
};

export default PoweredByVolca;
