const express = require('express');
const firebase = require('firebase');
const app = express();
const bodyParser = require('body-parser');
const IP_ADDRESS = "192.168.43.247";
const PORT = 3000;

var config = {
    apiKey: "AIzaSyCqkZJZrHDG1ePBWu9n_ebi3YxLhNuG9X0",
    authDomain: "fir-demo-74585.firebaseapp.com",
    databaseURL: "https://fir-demo-74585.firebaseio.com",
    storageBucket: "bucket.appspot.com"
};
firebase.initializeApp(config);
// Get a reference to the database service
var database = firebase.database();
app.use(bodyParser());
app.listen(PORT, IP_ADDRESS, () => {
    console.log(`${IP_ADDRESS}, Listening on 3000`);
});
app.get('/', (req, res) => {
    // res.send("Node Express Mongo server running");
    res.sendFile(__dirname + '/index.html');
});

app.post('/postDataToServer', (req, res) => {
    console.log(req.body);
    if (req && req.body && req.body && req.app.type) {
        writeData(req.body.type, req.body).then((result) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ code: 1000, status: "OK" }));
        });
    }
});

app.post('/postFormData', (req, res) => {
    console.log(req.body);
    if (req && req.body && req.body.type) {
        writeData(req.body.type, req.body).then((result) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ code: 1000, status: "OK" }));
        });
    }
});

app.get('/getDataFromServer', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req && req.query && req.query.type) {
        ReadData(req.query.type).then(snap => {
            if (snap) {
                var data = [];
                snap.forEach(ss => {
                    data.push(ss.val());
                });
                res.end(JSON.stringify({ code: 1000, status: "OK", result: data }));
            } else {
                res.end(JSON.stringify({ code: 1001, status: "Failed", result: [] }));
            }
        });
    }
});

const writeData = (type, data) => {
    return firebase.database().ref('arduino/' + type).push({ ...data, "timestamp": firebase.database.ServerValue.TIMESTAMP });
}

const ReadData = (type) => {
    return firebase.database().ref('/arduino/' + type).once('value');
}