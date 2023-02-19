const assert = require("assert");
const zeroPad = (num, numZeros) => {
    return String(num).padStart(numZeros, "0");
};

class Year360Date {
    static weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    #year;
    #dayOfYear;

    #normalize() {
        while (this.#dayOfYear >= this.getNumDaysInYear()) {
            this.#dayOfYear -= this.getNumDaysInYear();
            this.#year++;
        }
        while (this.#dayOfYear < 0) {
            this.#year--;
            this.#dayOfYear += this.getNumDaysInYear();
        }
    }

    constructor(gregorianDate) {
        const unixDays = Math.floor(gregorianDate.getTime() / 86_400_000);
        this.#year = 11970;
        this.setDayOfYear(unixDays + 10);
    }

    get year() {
        return this.#year;
    }

    set year(newYear) {
        assert(Number.isInteger(newYear), `Expected integer, got ${newYear}`);
        this.#year = newYear;
    }

    get dayOfYear() {
        return this.#dayOfYear;
    }

    set dayOfYear(newDayOfYear) {
        assert(Number.isInteger(newDayOfYear) && newDayOfYear >= 0,
            `Expected non-negative integer, got ${newDayOfYear}`);
        assert(newDayOfYear < this.getNumDaysInYear(),
            `Invalid day of year: ${newDayOfYear} (must be less than ${this.getNumDaysInYear()})`);

        this.#dayOfYear = newDayOfYear;
    }

    getMonth() {
        return Math.floor(this.#dayOfYear / 30);
    }

    getDay() {
        return this.#dayOfYear % 30;
    }

    getWeekday() {
        return Year360Date.weekdays[this.#dayOfYear % 6];
    }

    setDayOfYear(newDayOfYear) {
        assert(Number.isInteger(newDayOfYear),
            `Expected integer, got ${newDayOfYear}`);
        this.#dayOfYear = newDayOfYear;
        this.#normalize();
    }

    isLeapYear() {
        if (this.#year % 3200 === 0) {
            return false;
        }
        if (this.#year % 400 === 0) {
            return true;
        }
        if (this.#year % 100 === 0) {
            return false;
        }
        if (this.#year % 4 === 0) {
            return true;
        }
        return false;
    }

    static isLeapYear(year) {
        assert(Number.isInteger(year),
            `Expected integer, got ${year}`);
        if (year % 3200 === 0) {
            return false;
        }
        if (year % 400 === 0) {
            return true;
        }
        if (year % 100 === 0) {
            return false;
        }
        if (year % 4 === 0) {
            return true;
        }
        return false;
    }

    getNumDaysInYear() {
        return this.isLeapYear() ? 366 : 365;
    }

    static getNumDaysInYear(year) {
        assert(Number.isInteger(year),
            `Expected integer, got ${year}`);
        return Year360Date.isLeapYear(year);
    }

    getUnixTimestamp() {
        let dayCount = 0;
        for (let currentYear = 11970; currentYear < this.#year; currentYear++) {
            dayCount += Year360Date.getNumDaysInYear(currentYear);
        }
        for (let currentYear = this.#year; currentYear < 11970; currentYear++) {
            dayCount -= Year360Date.getNumDaysInYear(currentYear);
        }
        dayCount += this.#dayOfYear;
        return dayCount * 86_400;
    }

    toDateString() {
        return `${zeroPad(this.year, 5)}-${zeroPad(this.getMonth(), 2)}-${zeroPad(this.getDay(), 2)}`;
    }

    toString() {
        return `${this.toDateString()} ${this.getWeekday()}`;
    }
}

module.exports = Year360Date;
