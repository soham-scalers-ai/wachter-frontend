import React, { useState } from "react";
import {Button} from "@mui/material"

export const ControlToggleButton = (props) => {
    const [toggleState, setToggleState] = useState(false)

    function onButtonClick() {
        setToggleState(!toggleState);
        console.log(props.toggleButtonData["ButtonName"] + " " + " has state " + toggleState)
    }

    return(
        <div class="controlToggleButton" style={{
            bottom: `${props.toggleButtonData["ButtonLocation"][0]}em`,
            right: `${props.toggleButtonData["ButtonLocation"][1]}em`,
          }}>
            <Button disableRipple sx={{"&:hover": {background: "none" }}} onClick={onButtonClick}> {props.toggleButtonData["ButtonName"]} </Button>
        </div>
    )
}