const express = require('express');
const path = require('path');
const app = express();


// Routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'docs','index.html'));
});


// Port Listen
app.listen(3000);
console.log("Running...");