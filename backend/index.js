const app = require('express')();
const asyncHandler = require('express-async-handler')
const cors = require('cors')
const bp = require('body-parser')
const toml = require('toml')
const fs = require('fs')

const io = require('socket.io')(8081, {
    cors: {
        origin: ["http://localhost:3000"]
    }
})

const configs = toml.parse(fs.readFileSync('./objectConfigs.toml', 'utf-8'));

configs["rooms"].map((roomObj) => {
    roomObj["RoomObjects"].map((obj) => {
        if (obj["StateType"] == "Toggle") {
            obj["State"] = false
        } else if (obj["StateType"] == "Percentage") {
            obj["State"] = 0
        }
    })
})

states = configs["rooms"]

app.use(cors())
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

io.on("connection", (socket) => {
    socket.on("hooked", () => {
        io.emit("send-states", states)
    })
})


let statesOld = JSON.stringify(states)

function sendStates() {
    str = JSON.stringify(states);

    if (str != statesOld) {
        io.emit("send-states", states)
        statesOld = str
    }

    setTimeout(() => sendStates(), 300);
}

sendStates()

const controlEndpoint = asyncHandler(async (req, res, _) => {
    const {room, obj, state} = req.body

    for (let val of states) {
        if (val["RoomName"] == room) {
            for (let valObj of val["RoomObjects"]) {
                if (valObj["ObjectName"] == obj) {
                    if (valObj["StateType"] == "Toggle") {
                        valObj["State"] = !valObj["State"]
                    } else  {
                        valObj["State"] = state
                    }
                    break
                }
            }
            break
        }
    }
    
    res.status(200).send({})
})

const updateFrontend = asyncHandler(async (req, res, _) => {
    const {updatedStates} = req.body

    updatedStates.map((room) => {
        room["RoomObjects"].map((obj) => {
            for (let val of states) {
                if (val["RoomName"] == room["RoomName"]) {
                    for (let valObj of val["RoomObjects"]) {
                        if (valObj["ObjectName"] == obj["ObjectName"]) {
                            valObj["State"] = obj["State"]
                            break
                        }
                    }
                    break
                }
            }
        })
    })

    res.status(200).send({})
})

app.post("/api/controlEndpoint", controlEndpoint)
app.put("/api/updateFrontend", updateFrontend)

app.listen(8080)

console.log("Listening on port 8080")