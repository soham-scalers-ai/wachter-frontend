import React, { useState, useEffect } from "react";
import {Button} from "@mui/material"
import axios from 'axios';

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
            bottom: `${props.toggleButtonData["ButtonLocation"][0]}em`,
            right: `${props.toggleButtonData["ButtonLocation"][1]}em`,
          }}>
            <Button disableRipple sx={{"&:hover": {background: "none" }}} style={{ fontSize: '10px'}} onClick={onButtonClick}> 
                {props.toggleButtonData["State"] ? 
                props.toggleButtonData["TrueTxt"] :
                props.toggleButtonData["FalseTxt"] } 
            </Button>
        </div>
    )
}