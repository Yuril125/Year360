const prompt = require("prompt-sync")();

const y360Year = Number(prompt("Enter Year360 Year: "));
const y360Month = Number(prompt("Enter Year360 Month: "));
const y360Day = Number(prompt("Enter Year360 Day: "));

const dayOfYear = y360Month * 30 + y360Day;

const gregorian = new Date(y360Year - 10000, 0, dayOfYear + 1);

console.log(gregorian.toDateString());
