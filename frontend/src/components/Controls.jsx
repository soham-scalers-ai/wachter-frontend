import React, { useState, useEffect, useRef, useCallback } from "react";
import {FormControl, Select, MenuItem} from "@mui/material"
import {ControlToggleButton} from "./ControlToggleButton"
import {ControlSlider} from "./ControlSlider"
import {io} from "socket.io-client"

const socket = io("http://localhost:8081")

export const Controls = () => {
    const [states, setStates] = useState([])
    const [room, setRoom] = useState("")

    const handleStateSent = useCallback((sentStates) => {
        setStates(sentStates)
        if (room == "" || room == null) {
            setRoom(Object.keys(sentStates)[0])
        }
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
                <FormControl variant="standard" sx={{ m: 1.5, minWidth: 150}}>
                    <Select value={room} label="Room" onChange={handleRoomChange} defaultValue={Object.keys(states)[0]} style={{ color: 'white'}}>
                        {Object.keys(states).map((roomName) =>{
                            return (
                                <MenuItem value={roomName} >{roomName}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </div>
            <div className="RoomControls"> 
                {Object.keys(states).map((roomName) =>{
                    const roomObj = states[roomName]
                    return (
                        <div className={"room".concat(roomName == room)}> 
                            <div className="mainimg">
                                <img src={require("../images/".concat(roomObj["Image"]))}></img>
                            </div>
                            {Object.keys(roomObj["RoomObjects"]).map((objName) =>{
                                        const obj = roomObj["RoomObjects"][objName]
                                        return (
                                        <div className="room-obj"> 
                                            {obj["StateType"] == "Toggle"
                                                ? <ControlToggleButton toggleButtonRoom={roomName} toggleButtonData={obj}> </ControlToggleButton>
                                                : <ControlSlider sliderRoom={roomName} sliderData={obj}> </ControlSlider>
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