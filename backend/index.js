const app = require('express')();
const asyncHandler = require('express-async-handler')
const cors = require('cors')
const bp = require('body-parser')
const toml = require('toml')
const fs = require('fs')
const fetch = require("node-fetch")
const auth = require('http-auth');
const authConnect = require("http-auth-connect");

const basic = auth.basic({
	realm: 'Login',
	file: __dirname + '/credentials'
});

app.use(cors())
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

const io = require('socket.io')(8081, {
    cors: {
        origin: ["http://localhost:3000"]
    }
})

const states = toml.parse(fs.readFileSync('./objectConfigs.toml', 'utf-8'));

for (const room in states) {
    for (const obj in states[room]["RoomObjects"]) {
        objectConfigs = states[room]["RoomObjects"][obj]
        if (objectConfigs["StateType"] == "Toggle") {
            objectConfigs["State"] = false
        } else if (objectConfigs["StateType"] == "Percentage") {
            objectConfigs["State"] = 0
        }
    }
}

function setStates(updateStates) {
    for (const roomName in updateStates) {
        for (const objName in updateStates[roomName]) {
            const objectConfigs = states[roomName]["RoomObjects"][objName]
            if (objectConfigs["StateType"] == "Toggle") {
                objectConfigs["State"] = updateStates[roomName][objName] == "off" ? false : true
            } else if (objectConfigs["StateType"] == "Percentage") {
                objectConfigs["State"] = parseInt(updateStates[roomName][objName])
            }
        }
    }
}

fetch('http://localhost:8000/initEMLighting', {method: "PUT"}).then(
    (resp) => {
        fetch('http://localhost:8000/getState', {method: "GET"})
        .then(res => res.json())
        .then(
            (response) => {
                setStates(response.status)
            }
        )
    }
)

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
    const {room, obj} = req.body

    const options = {
        method: "PUT", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'areaName': room, 
            'luminaireName': obj,
        })
    }
    
    fetch('http://localhost:8000/toggleLuminaireState', options)
    .then(x => x.json())
    .then((x) => {
        res.status(200).send({})
    })
})

const updateFrontend = asyncHandler(async (req, res, _) => {
    const updatedStates = req.body
    setStates(updatedStates)
    res.status(200).send({})
})


const login = asyncHandler(async (_, res, __) => {
    res.status(200).send({
        ok: true
    })
})

app.post("/api/login", authConnect(basic), login)
app.post("/api/controlEndpoint", authConnect(basic), controlEndpoint)
app.post("/api/updateFrontend", updateFrontend)


app.listen(8080)

console.log("Listening on port 8080")