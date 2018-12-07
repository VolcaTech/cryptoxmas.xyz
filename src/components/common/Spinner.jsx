import React from "react";
import styles from "./styles";

const Spinner = () => (
  <div className="lds-spinner">
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
);

export const SpinnerOrError = ({ fetching, error }) => {
  if (!(fetching || error)) {
    return null;
  }
  return (
    <div style={styles.spinnerOrErrorContainer}>
      {fetching ? (
        <div style={styles.spinner}>
          <Spinner />
        </div>
      ) : (
        <span style={styles.spinnerError}>{error}</span>
      )}
    </div>
  );
};

export const Error = ({ fetching, error }) => {
  if (!(fetching || error)) {
    return null;
  }
  return (
    <div style={styles.spinnerOrErrorContainer}>
      <span style={styles.spinnerError}>{error}</span>
    </div>
  );
};

export const Loader = ({
  text = "Loading page...",
  textLeftMarginOffset = -50,
  instruction = ""
}) => (
  <div>
    <div className="centered-lds">
      <div className="lds-ring">
        <div />
        <div />
        <div />
        <div />
      </div>
      <div
        style={{
          ...styles.spinnerLoaderText,
          marginLeft: textLeftMarginOffset
        }}
      >
        <div style={{ textAlign: "center" }}>{text}</div>
        <div style={{ marginTop: 10 }}>{instruction}</div>
      </div>
    </div>
  </div>
);

export const ButtonLoader = () => (
  <div className="lds-button">
    <div />
    <div />
    <div />
    <div />
  </div>
);

export default Spinner;
