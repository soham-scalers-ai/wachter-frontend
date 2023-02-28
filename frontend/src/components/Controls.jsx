import React, { useState, useEffect, useRef, useCallback } from "react";
import {FormControl, Select, MenuItem} from "@mui/material"
import {ControlToggleButton} from "./ControlToggleButton"
import {ControlSlider} from "./ControlSlider"
import { io } from "socket.io-client"

const socket = io("http://localhost:8081")

export const Controls = () => {
    const [states, setStates] = useState([])
    const [room, setRoom] = useState("Diamond Room")

    const handleStateSent = useCallback((states) => {
        setStates(states)
    }, []);

    useEffect(() => {
        socket.on("send-states", handleStateSent)
        socket.emit("hooked", true)
        return () => {
            socket.off("send-states", handleStateSent)
        }
    }, [])

    function handleRoomChange(event) {
        setRoom(event.target.value);
    }

    return(
        <div className="controls">
            <div className="RoomSelector">
                <FormControl variant="standard" sx={{ m: 1.5, minWidth: 150 }}>
                    <Select value={room} label="Room" onChange={handleRoomChange}>
                        <MenuItem value={"Diamond Room"} >Diamond Room</MenuItem>
                        <MenuItem value={"Ruby Room"}>Ruby Room</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="RoomControls"> 
                {states.map((roomObj) =>{
                    return (
                        <div className={"room".concat(roomObj["RoomName"] == room)}> 
                            <div className="mainimg">
                                <img src={require("../images/".concat(roomObj["Image"]))}></img>
                            </div>
                            {roomObj["RoomObjects"].map((obj) =>{
                                        return (
                                        <div className="room-obj"> 
                                            {obj["StateType"] == "Toggle"
                                                ? <ControlToggleButton toggleButtonRoom={roomObj["RoomName"]} toggleButtonData={obj}> </ControlToggleButton>
                                                : <ControlSlider sliderRoom={roomObj["RoomName"]} sliderData={obj}> </ControlSlider>
                                            }
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