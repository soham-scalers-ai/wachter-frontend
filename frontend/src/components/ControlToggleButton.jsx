import React, { useState, useEffect } from "react";
import {Button, FormControl, InputLabel, Select, MenuItem} from "@mui/material"


export const ControlToggleButton = (props) => {
    const [toggleState, setToggleState] = useState(false)
    // const [position, setPosition] = useState([0,0])
    // const [orientation, setOrientation] = useState(0)

    // useEffect(() => {
        
    // }, [])

    // function handleRoomChange(event) {
    //     setRoom(event.target.value);
    // }

    // function extractRoom(obj) {
    //     return obj["RoomName"] == room
    // }

    return(
        <div class="controlToggleButton">
            <Button variant="contained"> {props.toggleButtonData["ButtonName"]} </Button>
        </div>
        // <div class="controls">
        //     <div class="RoomSelector">
        //         <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        //             <Select value={room} label="Room" onChange={handleRoomChange}>
        //                 <MenuItem value={"Diamond Room"}>Diamond Room</MenuItem>
        //                 <MenuItem value={"Ruby Room"}>Ruby Room</MenuItem>
        //             </Select>
        //         </FormControl>
        //     </div>
        //     {states.filter(extractRoom).map((room) =>{
        //         return (
        //             <div class="room"> 
        //                 <img src={require("../images/".concat(room["Image"]))}></img>
        //                 {room["RoomObjects"].map((buttonData) =>{
        //                             return (
        //                             <div class="room-obj"> 
        //                                 {<Button variant="contained">{buttonData["ButtonName"]}</Button>}
        //                             </div>
        //                             )
        //                         }
        //                     )
        //                 }
        //             </div>
        //         )
        //     })}
        // </div>
    )
}