import React, { useState, useEffect } from "react";
import {Button} from "@mui/material";
import axios from 'axios';
import imageOn from "../images/pointeron.png";
import imageOff from "../images/pointeroff.png";

export const ControlToggleButton = (props) => {
    function onButtonClick() {        
        let roomButtonIn = props.toggleButtonRoom
        let objButtonFor = props.toggleButtonData["ObjectName"]
        let credentials = localStorage.getItem('login-creds')
        axios.post('http://localhost:8080/api/controlEndpoint', {
            room: roomButtonIn,
            obj: objButtonFor,
        }, {
            auth: JSON.parse(credentials),
        })
    }

    return(
        <div className="controlToggleButton" style={{
            right: `${props.toggleButtonData["ControlLocation"][0]}em`,
            bottom: `${props.toggleButtonData["ControlLocation"][1]}em`,
            backgroundImage: props.toggleButtonData["State"] ? `url(${imageOn})` : `url(${imageOff})`
          }}>
            <Button disableRipple sx={{"&:hover": {background: "none" }}} style={{ fontSize: '20px', inlineSize: '25px', color: 'white'}} onClick={onButtonClick}> 
                {props.toggleButtonData["State"] ? 
                props.toggleButtonData["TrueTxt"] :
                props.toggleButtonData["FalseTxt"] } 
            </Button>
        </div>
    )
}