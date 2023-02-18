const prompt = require("prompt-sync")();

const gregorianYear = Number(prompt("Enter Gregorian Year (C.E.): "));
const gregorianMonth = Number(prompt("Enter Gregorian month (1-12): "));
const gregorianDay = Number(prompt("Enter Gregorian day (1-31): "));

const dayOfYear = (Date.UTC(gregorianYear, gregorianMonth - 1, gregorianDay)
                  - Date.UTC(gregorianYear, 0, 1))
                  / 86400000;

const zeroPad = (num, numZeros) => {
    return String(num).padStart(numZeros, "0");
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const y360Year = gregorianYear + 10000;
const y360Month = Math.floor(dayOfYear / 30);
const y360Day = dayOfYear % 30;
const y360Weekday = y360Day % 6;
const y360Date = `${zeroPad(y360Year, 5)}-${zeroPad(y360Month, 2)}-${zeroPad(y360Day, 2)} ${weekdays[y360Weekday]}`;

console.log(`\n${y360Date}\n`);
