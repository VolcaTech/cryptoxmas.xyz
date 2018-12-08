import React from "react";
import { Button } from "react-bootstrap";
import styles from "./styles";

class e2pButtonPrimary extends React.Component {
  render() {
    let buttonColor = this.props.buttonColor || "#4CD964";
    let fontColor = this.props.fontColor || "#fff";

    return (
      <Button
        className="button-primary"
        disabled={this.props.disabled}
        style={{
          ...styles.buttonPrimary,
          backgroundColor: buttonColor,
          borderColor: buttonColor,
          color: fontColor
        }}
        onClick={this.props.handleClick}
      >
        {this.props.children}
      </Button>
    );
  }
}

export default e2pButtonPrimary;
