import React, { useState, useEffect } from "react";
import {FormControl, Select, MenuItem} from "@mui/material"
import {ControlToggleButton} from "./ControlToggleButton"


export const Controls = () => {
    const [states, setStates] = useState([])
    const [room, setRoom] = useState("Diamond Room")

    useEffect(() => {
        setStates([{"RoomName": "Diamond Room", "Image": "rubyroom.png", "RoomObjects" : [
            {"ButtonName" : "Button1", "ButtonType" : "Toggle", "ButtonLocation": [6,0], "ButtonOrientation": 0},
            {"ButtonName" : "Button2", "ButtonType" : "Toggle", "ButtonLocation": [0,2.5], "ButtonOrientation": 0},
            {"ButtonName" : "Button3", "ButtonType" : "Toggle", "ButtonLocation": [3,6], "ButtonOrientation": 0}
            ]},
               {"RoomName": "Ruby Room", "Image": "diamondroom.png", "RoomObjects" : [
            {"ButtonName" : "Button4", "ButtonType" : "Toggle", "ButtonLocation": [6,7], "ButtonOrientation": 0},
            {"ButtonName" : "Button5", "ButtonType" : "Toggle", "ButtonLocation": [3,2], "ButtonOrientation": 0},
            {"ButtonName" : "Button6", "ButtonType" : "Toggle", "ButtonLocation": [4,5], "ButtonOrientation": 0}
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
            <div class="RoomControls"> 
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
        </div>
    )
}