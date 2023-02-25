const app = require('express')();

app.get('/', (req, res) => res.send("hello"))

app.get("/stream", (req, res) => {
    
    res.setHeader("Content-Type", "text/event-stream")

    send(res)
})

let i = 0;
function send(res) {
    res.write("data: " + `hello!${i}\n\n`)

    setTimeout(() => send(res), 1000)
    i = i + 1
}

app.listen(8080)

console.log("Listening on port 8080")