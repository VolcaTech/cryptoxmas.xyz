import React, { Component } from "react";
import PopUp from "./PopUp";
import QuestionButon from "./../common/QuestionButton";
import styles from "./styles";

class TitleAndDescription extends Component {
  state = {
    popUpShown: false
  };

  render() {
      return (
      <div>
      <div style={styles.homescreenTextContainer}>
        {this.state.popUpShown ? (
          <PopUp handleClick={() => this.setState({ popUpShown: false })} />
        ) : null}
        <div>
          <div style={{ display: "-webkit-box" }}>
            <span style={styles.redDot}>1</span>
            <div style={styles.homescreenGreenTitle}>
              Gift your friends Christmas Cards
            </div>
          </div>
          <div style={{ display: "-webkit-box" }}>
            <span style={styles.redDot}>2</span>
            <div style={styles.homescreenGreenTitle}>Support charity</div>
          </div>
          <div style={styles.homescreenWhiteText} onClick={() => this.setState({ popUpShown: true })}>
            Read
            <span
              className="hover"
              style={{ textDecoration: "underline", marginLeft: 4 }}
            >
              how it works & how to support charity
            </span>
            <QuestionButon
              width={19}
              height={19}
              backgroundColor="white"
              color="#474D5B"
              fontSize="12px"
              lineHeight="20px"
              marginLeft="10px"
            />
          </div>
        </div>
       </div>
        <div style={styles.greenContainer}>
          First, choose a Card{" "}
          <i
            className="fa fa-chevron-down"
            style={{ color: "white", fontSize: 17 }}
          />
          </div>
	  </div>
    );
  }
}

export default TitleAndDescription;
