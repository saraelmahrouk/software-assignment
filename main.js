const fs = require("fs");
const { start } = require("repl");

fs.readFile('shifts.txt', 'utf8', (err, data) => {
    if (err) throw err;
});


function timeToSec(time){

    const timeFormat = time.split(" ");
    let [h, m, s] = timeFormat[0].split(":").map(Number);
    
    if(timeFormat.length > 1 && timeFormat[1] == "pm") h += 12;

    let timeSec = h*3600 + m*60 + s;
    return timeSec;
}

function secToTime(seconds){

    const h = Math.floor(seconds / 3600);
    seconds %= 3600;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

}

function validateTimeFormat(time){
    const regex24 = /^(?:[01]?\d|2[0-3]):[0-5]\d:[0-5]\d\s?$/; 
    const regex12 = /^(0?[1-9]|1[0-2]):[0-5]\d:[0-5]\d\s?(AM|PM)$/i;

    if( !regex12.test(time) && !regex24.test(time))
        throw new Error(`The formatting for ${time} is wrong`);

}

function validateMatchingFormat(time1, time2){
    const regex24 = /^(?:[01]?\d|2[0-3]):[0-5]\d:[0-5]\d\s?$/; 
    const regex12 = /^(0?[1-9]|1[0-2]):[0-5]\d:[0-5]\d\s?(AM|PM)$/i;

    if((!regex12.test(time1) || !regex12.test(time2)) &&
    (!regex24.test(time1) || !regex24.test(time2)))
        throw new Error("Invalid time format");

}


// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getShiftDuration(startTime, endTime) {
    // TODO: Implement this function

    validateTimeFormat(startTime);
    validateTimeFormat(endTime);
    validateMatchingFormat(startTime, endTime);

    let startSec = timeToSec(startTime);
    let endSec = timeToSec(endTime);

    if (endSec < startSec) endSec += 24*3600;

    let diff = endSec - startSec;

    return secToTime(diff);
   }


// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getIdleTime(startTime, endTime) {
    // TODO: Implement this function

    validateTimeFormat(startTime);
    validateTimeFormat(endTime);
    validateMatchingFormat(startTime, endTime);
    // if((!regex12.test(startTime) || !regex12.test(endTime)) &&
    //     (!regex24.test(startTime) || !regex24.test(endTime)))
    //     return console.log("The format is not the same for start time and end time");

    const lowerBound = 8*3600;
    const upperBound = 22*3600;
 
    let startSec = timeToSec(startTime);
    let endSec = timeToSec(endTime);

    let idleTime = 0;
    idleTime += startSec < lowerBound ? lowerBound - startSec : 0;
    idleTime += endSec > upperBound ? endSec - upperBound : 0;

    return secToTime(idleTime);
}


// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
function getActiveTime(shiftDuration, idleTime) {
    // TODO: Implement this function
    
    validateTimeFormat(shiftDuration);
    validateTimeFormat(idleTime);

    activeTimeSec = timeToSec(shiftDuration) - timeToSec(idleTime);

    return secToTime(activeTimeSec);


}
console.log(getActiveTime("6:01:20", "00:00:00"));


// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    // TODO: Implement this function

}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    // TODO: Implement this function
}

// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
function setBonus(textFile, driverID, date, newValue) {
    // TODO: Implement this function
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
    // TODO: Implement this function
}

module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};
