const Year360Date = require("./Year360Date.cjs");
const prompt = require("prompt-sync")();

console.log("Today is " + new Year360Date() + ".\n");

const gregorianYear = Number(prompt("Enter Gregorian Year (C.E.): "));
const gregorianMonth = Number(prompt("Enter Gregorian month (1-12): "));
const gregorianDay = Number(prompt("Enter Gregorian day (1-31): "));

const gregorianDate = new Date(gregorianYear, gregorianMonth - 1, gregorianDay);
gregorianDate.setFullYear(gregorianYear);   // In case 0 <= gregorianYear <= 99

y360Date = new Year360Date(gregorianDate);
console.log("\n" + y360Date);
