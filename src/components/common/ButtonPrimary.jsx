import React from "react";
import { Button } from "react-bootstrap";
import styles from "./styles";

class e2pButtonPrimary extends React.Component {
  render() {
    return (
      <Button
        className="button-primary"
        disabled={this.props.disabled}
        style={styles.buttonPrimary}
        onClick={this.props.handleClick}
      >
        {this.props.children}
      </Button>
    );
  }
}

export default e2pButtonPrimary;
