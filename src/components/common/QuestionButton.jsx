import React from "react";

class QuestionButton extends React.Component {
  render() {
    return (
	<span
	   className="hover"
        style={{
          display: "inline-block",
          width: this.props.width || 25,
          height: this.props.height || 25,
          borderRadius: 12.5,
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          color: this.props.color || "#474D5B",
          backgroundColor: this.props.backgroundColor || "#8B8B8B",
          textAlign: "center",
          fontFamily: "Inter UI Regular",
          fontSize: this.props.fontSize || 16,
          lineHeight: this.props.lineHeight || "26px",
          marginLeft: this.props.marginLeft || 5,
          verticalAlign: "bottom"
        }}
      >
        ?
      </span>
    );
  }
}

export default QuestionButton;
