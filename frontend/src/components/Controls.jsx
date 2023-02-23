import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import {Button, FormControl, InputLabel, Select, MenuItem} from "@mui/material"
import {ControlToggleButton} from "./ControlToggleButton"


export const Controls = () => {
    const [states, setStates] = useState([])
    const [room, setRoom] = useState("Diamond Room")

    useEffect(() => {
        setStates([{"RoomName": "Diamond Room", "Image": "rubyroom.png", "RoomObjects" : [
            {"ButtonName" : "Button1", "ButtonType" : "Toggle", "ButtonLocation": [22,33], "ButtonOrientation": 90},
            {"ButtonName" : "Button2", "ButtonType" : "Toggle", "ButtonLocation": [22,33], "ButtonOrientation": 90},
            {"ButtonName" : "Button3", "ButtonType" : "Toggle", "ButtonLocation": [22,33], "ButtonOrientation": 90}
            ]},
               {"RoomName": "Ruby Room", "Image": "diamondroom.png", "RoomObjects" : [
            {"ButtonName" : "Button4", "ButtonType" : "Toggle", "ButtonLocation": [22,33], "ButtonOrientation": 90},
            {"ButtonName" : "Button5", "ButtonType" : "Toggle", "ButtonLocation": [22,33], "ButtonOrientation": 90},
            {"ButtonName" : "Button6", "ButtonType" : "Toggle", "ButtonLocation": [22,33], "ButtonOrientation": 90}
            ]}])
        }, [])

    function handleRoomChange(event) {
        setRoom(event.target.value);
    }

    function extractRoom(obj) {
        return obj["RoomName"] == room
    }

    return(
        <div class="controls">
            <div class="RoomSelector">
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <Select value={room} label="Room" onChange={handleRoomChange}>
                        <MenuItem value={"Diamond Room"}>Diamond Room</MenuItem>
                        <MenuItem value={"Ruby Room"}>Ruby Room</MenuItem>
                    </Select>
                </FormControl>
            </div>
            {states.filter(extractRoom).map((room) =>{
                return (
                    <div class="room"> 
                        <img src={require("../images/".concat(room["Image"]))}></img>
                        {room["RoomObjects"].map((buttonData) =>{
                                    return (
                                    <div class="room-obj"> 
                                        <ControlToggleButton toggleButtonData={buttonData}></ControlToggleButton>
                                    </div>
                                    )
                                }
                            )
                        }
                    </div>
                )
            })}
        </div>
    )
}