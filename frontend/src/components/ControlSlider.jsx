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
        let credentials = localStorage.getItem('login-creds')
        axios.post('http://localhost:8080/api/controlEndpoint', {
            room: roomButtonIn,
            obj: objButtonFor,
            state: perc
        }, {
            auth: JSON.parse(credentials),
        })
    }

    return(
        <div className="controlSlider" style={{
            right: `${props.sliderData["ControlLocation"][0]}em`,
            bottom: `${props.sliderData["ControlLocation"][1]}em`,
          }}>
            <div className="SliderLabel">{props.sliderData["SliderText"]}: {props.sliderData["State"]}%</div>
            <Slider min={0} max={100} size="small" value={props.sliderData["State"]} onChange={onSliderChange} onChangeCommitted={onSliderChangeCommitted}> </Slider>
        </div>
    )
}