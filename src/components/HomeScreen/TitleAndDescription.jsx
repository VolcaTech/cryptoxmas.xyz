import React, { Component } from "react";
import PopUp from "./PopUp";
import styles from "./styles";


class TitleAndDescription extends Component {
    state = {
	popUpShown: false
    };
    
    render() { 
	return (
            <div style={styles.homescreenTextContainer}>
              {this.state.popUpShown ? (
		  <PopUp handleClick={() => this.setState({ popUpShown: false })} />
              ) : null}
		<div style={styles.homescreenTextContainer}>
		<div style={styles.homescreenGreenTitle}>
            Surprise your Friends
                <br />
            with Crypto &
                <br />
            Support Charity
            </div>
		<div style={styles.homescreenGreyText}>
                *receiving crypto made easy
                <span
            className="hover"
            onClick={() => this.setState({ popUpShown: true })}
            style={{ textDecoration: "underline", marginLeft: 4 }}
                >
            for non-crypto friends
            </span>
            </div>
		<div style={styles.homescreenWhiteTitle}>
            First, choose a Nifty	
	    </div>
	    </div>
	    </div>	    
	)
    }
}


export default TitleAndDescription;
