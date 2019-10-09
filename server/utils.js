const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'status.json');
const seatCount = 4;
const seatAutoReleaseTime = 10; // secs

function setSeatStatus(_id, to, xh) {
    var jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    var jsonObject = JSON.parse(jsonContent);
    var succ = false;
    var id = _id - 1;
    if (to == "booked") {
        if (xh == null || xh == "") {
            succ = false;
        }
        else if (jsonObject.seats[id].status == 'free') {
            jsonObject.seats[id].status = 'booked';
            jsonObject.seats[id].by = xh;
            jsonObject.seats[id].heat = parseInt(jsonObject.seats[id].heat) + 1;
            jsonObject.seats[id].time = new Date().getTime();
            succ = true;
        } else {
            succ = false;
        }
    } else if (to == "free") {
        jsonObject.seats[id].status = 'free';
        jsonObject.seats[id].time = null;
        jsonObject.seats[id].by = "";
        succ = true;
    } else if (to == "busy") {
        if (jsonObject.seats[id].status != 'free') {
            jsonObject.seats[id].status = 'busy';
            succ = true;
        }
    } else if (to == "leave") {
        if (jsonObject.seats[id].status == "busy") {
            jsonObject.seats[id].status = 'leave';
            succ = true;
        } else {
            succ = false;
        }
    }
    if (succ) {
        var toPut = JSON.stringify(jsonObject);
        fs.writeFileSync(jsonPath, toPut);
    }
    return succ;
}

function releaseAll(password) {
    if (password == "z") {
        for (var i = 1; i <= seatCount; i++) {
            setSeatStatus(i, 'free', '');
        }
        return true;
    } else {
        return false;
    }
}

function checkLongTimeNoCome() {
    var jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    var jsonObject = JSON.parse(jsonContent);
    var ctime = new Date().getTime();
    var flag = false;
    for (var i = 0; i < seatCount; i++) {
        if (jsonObject.seats[i].status == "booked" &&
        ctime - jsonObject.seats[i].time >= seatAutoReleaseTime * 1000) {
            setSeatStatus(i + 1, "free", '');
            flag = true;
        }
    }
    if (flag) {
        console.log("[checkLongTimeNoCome]: Do release.");
    }
}

module.exports = {
    setSeatStatus: setSeatStatus,
    releaseAll: releaseAll,
    checkLongTimeNoCome: checkLongTimeNoCome
}