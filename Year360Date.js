const assert = (condition, message) => {
    if (!condition) {
        throw new Error(message);
    }
};

export default class Year360Date {
    static weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    #year;
    #dayOfYear;

    static #zeroPad(num, numZeros) {
        if (num < 0) {
            return "\u2212" + String(num).substring(1).padStart(numZeros, "0");
        }
        return String(num).padStart(numZeros, "0");
    }

    static #numLeapYearsBefore(year) {
        assert(Number.isInteger(year), `Expected integer, got ${year}`);
        year--;
        return Math.floor(year / 4)
             - Math.floor(year / 100)
             + Math.floor(year / 400)
             - Math.floor(year / 3200)
             + (year >= 0 ? 1 : 0);     // To account for year 00000
    }

    /**
     * Find the number of leap years between two years.
     * Includes the starting year; does not include the ending year.
     * @param {number} start year to start counting
     * @param {number} end year up to but not including which to stop counting
     * @returns Number of leap years in the range [start, end)
     */
    static numLeapYearsBetween(start, end) {
        assert(Number.isInteger(start) && Number.isInteger(end),
            `Expected integers, got ${start}, ${end}`);
        assert(start <= end, `Expected start <= end, got ${start}, ${end}`);
        return Year360Date.#numLeapYearsBefore(end)
             - Year360Date.#numLeapYearsBefore(start + 1);
    }

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

    /**
     * Construct a Year360Date object from a JavaScript Date object.
     * Note: uses the date in UTC; be careful if converting from local time. For
     * example, if the time is set to 22:00 in UTC-5, the next day will be used.
     *
     * @constructor
     * @param {date} [gregorianDate=new Date()] JavaScript Date object to
     *     convert to a Year360 date object
     *//**
     * Construct a Year360Date object from a Year360 year, month, day
     *
     * @constructor
     * @param {number} year The year
     * @param {number} month The month, an integer in the range [0, 12]
     * @param {number} day The day, an integer representing the day in the month
     */
    constructor(year = new Date(), month, day) {
        if(Number.isInteger(year) && Number.isInteger(month)
            && Number.isInteger(day)) {
                this.#year = year;
                if(month === 12) {
                    this.setToIntercalaris(day);
                } else {
                    this.setMonthDay(month, day);
                }
        } else {
            const unixDays = Math.floor(year.getTime() / 86_400_000);
            this.#year = 11970;
            this.setDayOfYear(unixDays + 10);
        }
    }

    get year() {
        return this.#year;
    }

    /**
     * Get the year as a string in the format YYYYY
     * @returns {string} The year in the format YYYYY
     */
    getYearString() {
        return Year360Date.#zeroPad(this.year, 5);
    }

    set year(year) {
        assert(Number.isInteger(year), `Expected integer, got ${year}`);
        assert(this.#dayOfYear < Year360Date.getNumDaysInYear(year),
            `Cannot set year to ${this.getYearString()}: `
            + `dayOfYear=${this.#dayOfYear}, which does not exist in the year `
            + this.getYearString());
        this.#year = year;
    }

    get dayOfYear() {
        return this.#dayOfYear;
    }

    set dayOfYear(dayOfYear) {
        assert(Number.isInteger(dayOfYear) && dayOfYear >= 0,
            `Expected non-negative integer, got ${dayOfYear}`);
        assert(dayOfYear < this.getNumDaysInYear(),
            `Invalid day of year: ${dayOfYear} ` +
            `(must be less than ${this.getNumDaysInYear()})`);

        this.#dayOfYear = dayOfYear;
    }

    /**
     * Get the month of the year
     * @returns {number} The month, an integer in the range [0, 12]
     */
    getMonth() {
        return Math.floor(this.#dayOfYear / 30);
    }

    /**
     * Get the day of the month
     * @returns {number} The day of the month, an integer in the range [0, 29]
     */
    getDay() {
        return this.#dayOfYear % 30;
    }

    /**
     * Set the month and day in the nominal year
     * @param {number} [month] The month, an integer in the range [0, 11].
     * @param {number} [day] The day, an integer in the
     *     range [0, 29].
     */
    setMonthDay(month = this.getMonth(), day = this.getDay()) {
        assert(Number.isInteger(month) && month >= 0 && month <= 11,
            `Expected month to be integer in range [0, 11], got ${month}`);
        assert(Number.isInteger(day) && day >= 0 && day <= 29,
            `Expected day to be integer in range [0, 29], got ${day}`);
        this.#dayOfYear = month * 30 + day;
    }

    /**
     * Set the date to a day in Intercalaris
     * @param {number} [day=0] The day, a non-negative integer no greater than
     *     the last day in Intercalaris.
     */
    setToIntercalaris(day = 0) {
        const lastDay = this.getNumDaysInYear() - 361;
        assert(Number.isInteger(day) && day >= 0 && day <= lastDay,
            `Expected day to be integer in range [0, ${lastDay}], got ${day}`);
        this.#dayOfYear = 360 + day;
    }

    /**
     * Get the day of the week, represented as an integer. 0 represents Monday,
     * 1 represents Tuesday, ... 5 represents Saturday.
     * @returns {number} The day of the week, represented as an integer [0, 5]
     */
    getWeekday() {
        return this.#dayOfYear % 6;
    }

    /**
     * Get the day of the week as a three-character string (e.g. "Mon", "Tue")
     * @returns {string} The day of the week, represented as a three-character
     *     string
     */
    getWeekdayString() {
        return Year360Date.weekdays[this.getWeekday()];
    }

    /**
     * Get the week of the year
     * @returns The week of the year, an integer in the range [0, 60]
     */
    getWeek() {
        return Math.floor(this.#dayOfYear / 6);
    }

    /**
     * Set the day of the year. A day outside the range of days in the year are
     * wrapped around appropriately. For example, using setDayOfYear(365) in a
     * common year or using setDayOfYear(366) in a leap year sets the date to
     * the first day of the next year; using setDayOfYear(-1) sets the date to
     * the last day of the previous year.
     * @param {number} dayOfYear The day of the year
     */
    setDayOfYear(dayOfYear) {
        assert(Number.isInteger(dayOfYear),
            `Expected integer, got ${dayOfYear}`);
        this.#dayOfYear = dayOfYear;
        this.#normalize();
    }

    /**
     * Get whether the year is a leap year
     * @returns {boolean} Whether the year is a leap year
     */
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

    /**
     * Get whether a given year is a leap year
     * @param {number} year The year which to check whether is a leap year
     * @returns {boolean} Whether the year is a leap year
     */
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

    /**
     * Get the number of days in the year
     * @returns {number} The number of days in the year, 365 or 366
     */
    getNumDaysInYear() {
        return this.isLeapYear() ? 366 : 365;
    }

    /**
     * Get the number of days in a given year
     * @param {number} year The year to get the number of days of
     * @returns The number of days in the year, 365 or 366.
     */
    static getNumDaysInYear(year) {
        assert(Number.isInteger(year),
            `Expected integer, got ${year}`);
        return Year360Date.isLeapYear(year) ? 366 : 365;
    }

    /**
     * Get the Unix timestamp of the current date in UTC
     * @returns {number} The Unix timestamp of the current date
     */
    getUnixTimestamp() {
        let dayCount = -10;     // Unix epoch is on 11970-00-10
        for (let i = 11970; i < this.#year; i++) {
            dayCount += Year360Date.getNumDaysInYear(i);
        }
        for (let i = this.#year; i < 11970; i++) {
            dayCount -= Year360Date.getNumDaysInYear(i);
        }
        dayCount += this.#dayOfYear;
        return dayCount * 86_400;
    }

    /**
     * Get the current date as a JavaScript Date object in UTC. You can then
     * use the getUTC* methods to get the year, month, and day in the Gregorian
     * calendar.
     * @returns {date} The current date, in UTC
     */
    toGregorianDate() {
        return new Date(this.getUnixTimestamp() * 1000);
    }

    /**
     * Get the date as a string in the format YYYYY-MM-DD
     * @returns {string} The date in the format YYYYY-MM-DD
     */
    toDateString() {
        return `${Year360Date.#zeroPad(this.year, 5)}-${Year360Date.#zeroPad(this.getMonth(), 2)}-${Year360Date.#zeroPad(this.getDay(), 2)}`;
    }

    /**
     * The date in the format YYYYY-MM-DD followed by a space, then the three-
     * character weekday
     * @returns {string} The date as a string
     */
    toString() {
        return `${this.toDateString()} ${this.getWeekdayString()}`;
    }
}


