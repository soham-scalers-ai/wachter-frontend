import React, { useState, useEffect } from "react";
import {Button} from "@mui/material"
import axios from 'axios';
import imageOn from "../images/pointeron.png"; 
import imageOff from "../images/pointeroff.png"; 

export const ControlToggleButton = (props) => {
    function onButtonClick() {        
        let roomButtonIn = props.toggleButtonRoom
        let objButtonFor = props.toggleButtonData["ObjectName"]
        axios.post('http://localhost:8080/api/controlEndpoint', {
            room: roomButtonIn,
            obj: objButtonFor,
          })
    }

    return(
        <div className="controlToggleButton" style={{
            bottom: `${props.toggleButtonData["ControlLocation"][0]}em`,
            right: `${props.toggleButtonData["ControlLocation"][1]}em`,
            backgroundImage: props.toggleButtonData["State"] ? `url(${imageOn})` : `url(${imageOff})`
          }}>
            {console.log({
            bottom: `${props.toggleButtonData["ControlLocation"][0]}em`,
            right: `${props.toggleButtonData["ControlLocation"][1]}em`,
            backgroundImage: props.toggleButtonData["State"] ? '../images/pointeron.png' : '../images/pointeroff.png'
          })}
            <Button disableRipple sx={{"&:hover": {background: "none" }}} style={{ fontSize: '10px', inlineSize: '25px', color: 'white'}} onClick={onButtonClick}> 
                {props.toggleButtonData["State"] ? 
                props.toggleButtonData["TrueTxt"] :
                props.toggleButtonData["FalseTxt"] } 
            </Button>
        </div>
    )
}