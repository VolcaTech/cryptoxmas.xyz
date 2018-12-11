import React from "react";

class QuestionButton extends React.Component {
  render() {
    return (
	<span
	   className="hover"
        style={{
          display: "inline-block",
          width: 25,
          height: 25,
          borderRadius: 12.5,
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          color: "#474D5B",
          backgroundColor: "#8B8B8B",
          textAlign: "center",
          fontFamily: "SF Display Bold",
          fontSize: 16,
          lineHeight: "26px",
          marginLeft: 5
        }}
      >
        ?
      </span>
    );
  }
}

export default QuestionButton;
