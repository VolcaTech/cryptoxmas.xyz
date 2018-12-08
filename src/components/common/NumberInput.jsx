import React from "react";
import { FormControl } from "react-bootstrap";
import styles from "./styles";

class e2pInput extends React.Component {
  render() {
    return (
      <FormControl
        onChange={this.props.onChange}
        disabled={this.props.disabled}
        componentClass="input"
        value={this.props.value}
        type={this.props.type}
        readOnly={this.props.readOnly}
        style={{
          ...styles.numberInput,
          height: this.props.height || 50,
          textAlign: this.props.textAlign || "center"
        }}
        placeholder={this.props.placeholder}
        componentClass={this.props.componentClass}
        rows={this.props.rows}
        maxLength={this.props.maxLength}
      />
    );
  }
}

export default e2pInput;
