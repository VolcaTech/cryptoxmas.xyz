import React from "react";
import RetinaImage from "react-retina-image";
import { Row, Grid } from "react-bootstrap";

class Header extends React.Component {
  render() {
    return (
      <Grid style={{ backgroundColor: "#474D5B", margin: "auto" }}>
        <Row style={{ paddingTop: "30px", textAlign: "center" }}>
          <a href="/" className="no-underline">
            <RetinaImage
              className="img-responsive"
              style={{ display: "inline" }}
              src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/wreath.png"
            />
            <div
              style={{
                display: "inline",
                marginLeft: 87.5,
                fontFamily: "Inter UI Bold",
                fontSize: 30,
                color: "white",
                textAlign: "right"
              }}
            >
              Crypto Xmas
            </div>
          </a>
        </Row>
      </Grid>
    );
  }
}

export default Header;
