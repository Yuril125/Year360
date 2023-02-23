const Year360Date = require("./Year360Date.cjs");
const prompt = require("prompt-sync")();

console.log("Today is " + new Year360Date() + ".\n");

const y360Year = Number(prompt("Enter Year360 Year: "));
const y360Month = Number(prompt("Enter Year360 Month: "));
const y360Day = Number(prompt("Enter Year360 Day: "));

const y360Date = new Year360Date(y360Year, y360Month, y360Day);
console.log("\n" + y360Date.toGregorianDate().toISOString().split("T")[0]);
