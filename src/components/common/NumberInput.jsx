import React, { Component } from "react";
import { FormControl } from 'react-bootstrap';


class e2pInput extends React.Component {
    render() {
        return (
            <FormControl
	       onChange={this.props.onChange}
	       disabled={this.props.disabled}
	       componentClass='input'
	       value={this.props.value}
	        style={{
                   width: 300,
                   height: 50,
                   borderRadius: 12,
                   border: '2px solid #8B8B8B',
                   color: '#8B8B8B',		   
                   backgroundColor: this.props.backgroundColor,
                   fontSize: 20,
                   letterSpacing: 1.5,
                   textAlign: 'center',
                   boxShadow: 0,
                   display: 'block', 
                   margin: 'auto',
                   fontFamily: "Inter UI Regular",                 
                   WebkitBoxShadow: 'none'
               }} placeholder={this.props.placeholder}>
            </FormControl>
        );
    }
}

export default e2pInput;
