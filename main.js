const fs = require("fs");
const { start } = require("repl");


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

function validateShiftObj(shiftObj) {
    if (!shiftObj.driverID) throw new Error("driverID is required");
    if (!shiftObj.driverName) throw new Error("driverName is required");
    if (!shiftObj.date) throw new Error("date is required");
    if (!shiftObj.startTime || !shiftObj.endTime) throw new Error("startTime and endTime are required");
}

function validateMonth(month){
    const regexMonth = /^(0?[1-9]|1[1-2])$/; 
    if(!regexMonth.test(month))
        throw new Error("Invalid month format");
}

function validateHoursSum(hours){
    const regexHours = /^(?:\d?\d?\d|2[0-3]):[0-5]\d:[0-5]\d\s?$/; 

    if( !regexHours.test(hours))
        throw new Error(`The formatting for ${time} is wrong`);

}

function readFile(textFile){
    const file  = fs.readFileSync(textFile, 'utf8');
    const lines = file.split("\n").filter(line => line.trim() !== "");
    return lines;
}


// function extractMonth(textFile, month){
//     const file = fs.readFileSync(textFile, 'utf8');
//     const lines = file.split("\n").filter(line => line.trim() !== "");

// }

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
    
    validateHoursSum(shiftDuration);
    validateHoursSum(idleTime);

    activeTimeSec = timeToSec(shiftDuration) - timeToSec(idleTime);

    return secToTime(activeTimeSec);


}

// console.log(getActiveTime ("06:40:20", "003:10:10"));

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    // TODO: Implement this function
    
    if(isNaN(new Date(date).getTime()))
        throw new Error("Invalid Date");

    validateTimeFormat(activeTime);

    const dailyQuota = timeToSec("8:24:00");
    const eidDailyQuota = timeToSec("6:00:00");
    const activeSec = timeToSec(activeTime);

    if( date > "2025-04-10" && date < "2025-04-30")
        return activeSec >= eidDailyQuota
    return activeSec >= dailyQuota;
}

// console.log(metQuota("2025-03-23", "5:42:59"));
// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    // TODO: Implement this function
    try{

        validateShiftObj(shiftObj);

        const lines = readFile(textFile);
        let flag = false;

        lines.forEach(line => {
            if (line.includes(shiftObj.driverID) && line.includes(shiftObj.date)){
                flag = true;
            }
        })
        if(!flag){

            shiftObj.shiftDuration = getShiftDuration(shiftObj.startTime, shiftObj.endTime);
            shiftObj.idleTime = getIdleTime(shiftObj.startTime, shiftObj.endTime);
            shiftObj.activeTime = getActiveTime(shiftObj.shiftDuration, shiftObj.idleTime);
            shiftObj.metQuota = metQuota(shiftObj.date, shiftObj.activeTime);
            shiftObj.hasBonus = false;

            const newLine = [
                shiftObj.driverID,
                shiftObj.driverName,
                shiftObj.date,
                shiftObj.startTime,
                shiftObj.endTime,
                shiftObj.shiftDuration,
                shiftObj.idleTime,
                shiftObj.activeTime,
                shiftObj.metQuota,
                shiftObj.hasBonus
            ].join(",");

            let insertIndex = lines.map(line => line.split(",")[0]).lastIndexOf(shiftObj.driverID);
            if (insertIndex === -1) {
            lines.push(newLine);
            } else {
                lines.splice(insertIndex + 1, 0, newLine);
            }   
            fs.writeFileSync(textFile, lines.join("\n") + "\n", 'utf8');
            console.log("File written successfully");
            return shiftObj;
        }
        else{
            console.log("Already in the file");
            return {};
        }
    }
    catch (err){
        console.log(err);
        return {};
    }
}

// let shiftObj = { driverID: "D1001", driverName: "Ahmed Hassan", date: "2025-04-30",
//  startTime: "6:32:26 am",  endTime: "7:26:20 pm" };
//  let textFile = "shifts.txt"; 
// ( () => {
//     let result = addShiftRecord(textFile, shiftObj);
//     console.log(result);
// })();

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

    try{
    if(isNaN(new Date(date).getTime()))
        throw new Error("Invalid Date");

    if (!driverID) 
        throw new Error("driverID is required");

     if (!newValue) 
        throw new Error("newValue is required");

    const lines = readFile(textFile);
    let flag = false;

    const updatedLines = lines.map(line => {
            if (line.includes(driverID) && line.includes(date)){
                let data = line.split(",");
                data[9] = newValue;
                flag = true;
                return data.join(",");
            }
            return line;
          })
    if(!flag){
        console.log("No such entry exists");
    }
    else{
         fs.writeFileSync(textFile, updatedLines.join("\n") + "\n", 'utf8');
        console.log("Changes have been made successfully");}
    }
    catch (err){
        console.log(err);
    }

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
    try{
        if (!driverID) 
            throw new Error("driverID is required");
        validateMonth(month);
    

        const lines = readFile(textFile);
        let count = 0;

        const driverBonus = lines.map(line => {
            const data = line.split(",");
            if(data[0] == driverID){
                if(isNaN(new Date(data[2]).getTime()))
                    throw new Error("Invalid Date");
                let date = data[2].split("-");
                if(Number(date[1]) == Number(month)){
                    const bonus = data[9];
                    return bonus; 
                } 
            }
            return null;
        })
        .filter(m => m !== null);

        let countTrue = driverBonus
                        .filter(x => x.trim() === 'true')
                        .length;
        countTrue = countTrue > 0 ? countTrue: -1;
        return countTrue;
    
    }
    catch(err){
        console.log(err);
        return null;
    }
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
    
    try{
        if (!driverID) 
            throw new Error("driverID is required");
        validateMonth(month);

        const lines = readFile(textFile);
    
        const allActiveTime = lines.map(line => {
                const data = line.split(",");
                if(data[0] == driverID){
                    if(isNaN(new Date(data[2]).getTime()))
                        throw new Error("Invalid Date");
                    let date = data[2].split("-");
                    if(Number(date[1]) == Number(month)){
                        const activeTime = timeToSec(data[7]);
                        return activeTime;
                    } 
                }
                return null;
            })
            .filter(m => m !== null);

        let totalActiveTime = allActiveTime.reduce((total, num) => total + num, 0);

        return secToTime(totalActiveTime);

        }

    catch(err){
        console.log(err);
        return null;
    }
}

// console.log(getTotalActiveHoursPerMonth("shifts.txt", "D1001", "4"));

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

    try{
        // if (!bonusCount) 
        //     throw new Error("bonusCount is required");
        if (!driverID) 
            throw new Error("driverID is required");
        validateMonth(month);

        const lines = readFile(textFile);
        const rateLines = readFile(rateFile);
        const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const holiday = rateLines.map(line => {
            const data = line.split(",");
            if(data[0] == driverID)
                return data[1];
            return null;
        })
        .filter(m => m !== null);

        let requiredSecs = 0;
        requiredSecs -= bonusCount * 2 * 3600;

        lines.slice(1).forEach(line => {
            const data = line.split(",");
            date = new Date(data[2]);
            m = date.getMonth() + 1;
            const day = days[date.getDay()];
            if(day == holiday[0])
                return;
            if(data[0] == driverID && m == month){
                if(date >= new Date("2025-04-10") && date <= new Date("2025-04-30")){
                    requiredSecs += (6*3600);
                }
                else{
                    requiredSecs += (8*3600 + 24*60);
                }
            }            
        })
        return secToTime(requiredSecs);
    
    }
    catch(err){
        console.log(err);
        return null;
    }
}

console.log(getRequiredHoursPerMonth("shifts.txt", "driverRates.txt", 1, "D1001", "4"));

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
    try{
        if (!driverID) 
            throw new Error("driverID is required");
        validateHoursSum(actualHours);
        validateHoursSum(requiredHours);

        const rateLines = readFile(rateFile);

        const basePay = Number(rateLines.find(line => line.split(",")[0] === driverID)?.split(",")[2] || 0);
        const tier = Number(rateLines.find(line => line.split(",")[0] === driverID)?.split(",")[3] || 0);
        let missingHoursInSec = timeToSec(requiredHours) - timeToSec(actualHours) < 0 ? 0 : timeToSec(requiredHours) - timeToSec(actualHours);

        switch(tier) {
            case 1:
                missingHoursInSec = missingHoursInSec - 50*3600 < 0 ? 0 : missingHoursInSec - 50*3600;
                break;
            case 2:
                missingHoursInSec = missingHoursInSec - 20*3600 < 0 ? 0 : missingHoursInSec - 20*3600;
                break;
            case 3:
                missingHoursInSec = missingHoursInSec - 10*3600 < 0 ? 0 : missingHoursInSec - 10*3600;
                break;
            case 4:
                missingHoursInSec = missingHoursInSec - 3*3600 < 0 ? 0 : missingHoursInSec - 3*3600;
                break;
            default:
                missingHoursInSec = 0;
        }

        const missingHours = Math.floor(missingHoursInSec/3600);
        const deductionRatePerHour = Math.floor(basePay / 185);
        const salaryDeduction = missingHours * deductionRatePerHour;
        const netPay = basePay - salaryDeduction;

        return netPay;
    }
    catch(err){
        console.log(err);
        return null;
    }
}

console.log(getNetPay("D1001", "146:20:00", "168:00:00", "driverRates.txt"));


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
