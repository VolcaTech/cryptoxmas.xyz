import React from "react";
import { Button } from "react-bootstrap";

class e2pButtonPrimary extends React.Component {
  render() {
    return (
      <Button
        className="button-primary"
        disabled={this.props.disabled}
        style={{
          display: "block",
          margin: "auto",
          width: 300,
          height: 50,
          borderRadius: 12,
          borderColor: "#4CD964",
          backgroundColor: "#4CD964",
          opacity: this.props.disabled ? 0.5 : 1,
          color: "#fff",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          fontSize: this.props.fontSize ? this.props.fontSize : 20,
          fontFamily: "Inter UI Medium"
        }}
        onClick={this.props.handleClick}
      >
        {this.props.children}
      </Button>
    );
  }
}

export default e2pButtonPrimary;
