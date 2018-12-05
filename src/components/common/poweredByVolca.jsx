import React from "react";

const PoweredByVolca = () => {
  return (
    <div
      style={{
        width: "100%",
        paddingTop: 50
      }}
    >
      <div style={{ width: "100%", textAlign: "center", paddingBottom: 20 }}>
        <a href="https://volca.tech" style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "inline",
              fontSize: 18,
              fontFamily: "Inter UI Medium",
              color: "#979797"
            }}
          >
            Powered by{" "}
          </div>
          <div
            style={{
              display: "inline",
              fontSize: 18,
              fontFamily: "Inter UI Bold",
              color: "#4CD964"
            }}
          >
            Volcà
          </div>
        </a>
      </div>
    </div>
  );
};

export default PoweredByVolca;
