const assert = require("assert");

class Year360Date {
    static weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    #year;
    #dayOfYear;

    constructor(gregorianDate) {
        const unixDays = Math.floor(gregorianDate.getTime() / 86_400_000);
        this.#year = 11970;
        this.setDayOfYear(unixDays + 10);
    }

    #normalize() {
        while (this.#dayOfYear >= this.numDaysInYear) {
            this.#dayOfYear -= this.numDaysInYear;
            this.#year++;
        }
        while (this.#dayOfYear < 0) {
            this.#year--;
            this.#dayOfYear += this.numDaysInYear;
        }
    }

    get year() {
        return this.#year;
    }

    set year(newYear) {
        assert(Number.isInteger(newYear), `Expected integer, got ${newYear}`);
        this.#year = newYear;
    }

    get month() {
        return Math.floor(this.#dayOfYear / 30);
    }

    get day() {
        return this.#dayOfYear % 30;
    }

    get weekday() {
        return Year360Date.weekdays[this.#dayOfYear % 6];
    }

    get dayOfYear() {
        return this.#dayOfYear;
    }

    set dayOfYear(newDayOfYear) {
        assert(Number.isInteger(newDayOfYear),
            `Expected integer, got ${newDayOfYear}`);
        assert(newDayOfYear >= 0,
            `Expected positive number, got ${newDayOfYear}`);
        assert(newDayOfYear < this.numDaysInYear,
            `${newDayOfYear} invalid (must be less than ${this.numDaysInYear})`);

        this.#dayOfYear = newDayOfYear;
    }

    setDayOfYear(newDayOfYear) {
        assert(Number.isInteger(newDayOfYear),
            `Expected integer, got ${newDayOfYear}`);
        this.#dayOfYear = newDayOfYear;
        this.#normalize();
    }

    get isLeapYear() {
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

    get numDaysInYear() {
        return this.isLeapYear ? 366 : 365;
    }
}

module.exports = Year360Date;
