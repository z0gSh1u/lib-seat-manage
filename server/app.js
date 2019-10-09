const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const utils = require('./utils')

var app = express();

// Middle-Wares
app.use(bodyParser.json({
    limit: 3*1024*1024,
    extented: false,
}))
app.use(bodyParser.urlencoded({
    limit: 3*1024*1024,
    extended: false,
}))
app.use(express.static('./web'));

// Request Routers
app.get('/api/status', function(req, res) {
    var statusJsonPath = path.join(__dirname, 'status.json');
    fs.readFile(
        statusJsonPath, function(err, data) {
            if (err) {
                res.send('Error occured when requesting status.json.');
            } else {
                res.send(data);
            }
    });
});
app.post('/api/book', function(req, res) {
    var rtn = utils.setSeatStatus(req.body.id, "booked", req.body.xh);
    if (rtn) {
        res.send(req.body.xh + " 预定座位 " + req.body.id + " 成功。");
    } else {
        res.send("预定失败");
    }
})
app.post('/api/set_leave', function(req, res) {
    var rtn = utils.setSeatStatus(req.body.id, "leave", "");
    if (rtn) {
        res.send(req.body.id + " SetLeave success.");
    } else {
        res.send(req.body.id + " SetLeave failed.");
    }
})
app.post('/api/set_busy', function(req, res) {
    var rtn = utils.setSeatStatus(req.body.id, "busy", "");
    if (rtn) {
        res.send(req.body.id + " SetBusy success.");
    } else {
        res.send(req.body.id + " SetBusy failed.");
    }
})
app.post('/api/set_free', function(req, res) {
    var rtn = utils.setSeatStatus(req.body.id, "free", "");
    if (rtn) {
        res.send(req.body.id + " SetFree success.");
    } else {
        res.send(req.body.id + " SetFree failed.");
    }
})
app.post('/api/release_all', function(req, res) {
    var rtn = utils.releaseAll(req.body.pw);
    if (rtn) {
        res.send('ReleaseAll success.');
    } else {
        res.send('ReleaseAll failed.');
    }
})

const checker = setInterval(()=>{
    utils.checkLongTimeNoCome()
}, 1000);

app.listen(8888);