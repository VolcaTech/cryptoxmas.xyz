import React from "react";
import RetinaImage from "react-retina-image";
import { Row, Col } from "react-bootstrap";
import styles from "./../styles";

class Header extends React.Component {
  render() {
    return (
      <Row style={styles.headerContainer}>
        <a href="/" className="no-underline" style={{ width: "100%" }}>
          <div style={{ width: "30%", display: "inline" }}>
            <RetinaImage
              className="img-responsive"
              src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/wreath.png"
              style={{display: "inline", float: "left"}}
            />
          </div>
          <div style={{ width: "70%", float: "right", paddingTop: 15, }}>
            <div style={styles.headerText}>Crypto Xmas</div>
          </div>
        </a>
      </Row>
    );
  }
}

export default Header;
