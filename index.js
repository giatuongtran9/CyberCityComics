const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch');
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const PORT = 8000;
const app = express();
const router = express.Router()


app.use(cors())
const corsOptions = {
    origin: "*"
};

var timeSpend = {}

app.use(express.static("public/homepage"));
app.use(express.static("public/page"));
app.use(bodyParser.json())

const url = "https://xkcd.com/"

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/homepage/index.html'));
});

router.get("/:num", (req, res) => {
    res.sendFile(path.join(__dirname + '/public/homepage/index.html'));
})

app.get('/getData', cors(corsOptions), async (req, res) => {
    
    const response = await fetch(url + "/info.0.json", { method: 'GET'})
    const jsonRes = await response.json();
    res.json(jsonRes);
});

app.get("/getData/:num", cors(corsOptions), async (req, res) => {
    const response = await fetch((url + req.params.num + "/info.0.json"))
    const jsonRes = await response.json();
    res.json(jsonRes)
})

// update the current time spent on the page to the server
app.post("/updateTime", bodyParser.text(), (req, res) => {
    var body = JSON.parse(req.body);
    console.log(body)
    timeSpend[body.num] = timeSpend[body.num] ? (timeSpend[body.num] + body.timespend) : body.timespend
    console.log(timeSpend[body.num])
    console.log(body.timespend)
    res.send({"time-spend": timeSpend})
})

app.get("/updateTime", (req, res) => {
    res.send({timeSpend: timeSpend})
})

app.use("/", router)

app.listen(PORT, () => {
    console.log(`app listenning at PORT: ${PORT}`);
});
