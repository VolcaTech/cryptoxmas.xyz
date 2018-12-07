import React from "react";
import RetinaImage from "react-retina-image";
import { Row, Grid } from "react-bootstrap";
import styles from "./../styles";

class Header extends React.Component {
  render() {
    return (
      <Row style={styles.headerContainer}>
        <a href="/" className="no-underline">
          <RetinaImage
            className="img-responsive"
            style={{ display: "inline" }}
            src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/wreath.png"
          />
          <div style={styles.headerText}>Crypto Xmas</div>
        </a>
      </Row>
    );
  }
}

export default Header;
