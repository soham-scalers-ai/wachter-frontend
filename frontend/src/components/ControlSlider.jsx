import React, { useState } from "react";
import {Slider} from "@mui/material"
import axios from 'axios';

export const ControlSlider = (props) => {
    const [perc, setPerc] = useState(0)

    function onSliderChange(event, newValue) {
        setPerc(newValue)
    }

    function onSliderChangeCommitted() {        
        let roomButtonIn = props.sliderRoom
        let objButtonFor = props.sliderData["ObjectName"]
        axios.post('http://localhost:8080/api/controlEndpoint', {
            room: roomButtonIn,
            obj: objButtonFor,
            state: perc
        })
    }

    return(
        <div className="controlSlider" style={{
            bottom: `${props.sliderData["ControlLocation"][0]}em`,
            right: `${props.sliderData["ControlLocation"][1]}em`,
          }}>
            <div className="SliderLabel">{props.sliderData["SliderText"]}: {props.sliderData["State"]}%</div>
            <Slider min={0} max={100} size="small" onChange={onSliderChange} onChangeCommitted={onSliderChangeCommitted}> </Slider>
        </div>
    )
}