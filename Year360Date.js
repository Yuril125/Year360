class Year360Date {
    static weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    #year;
    #dayOfYear;

    constructor(gregorianDate) {
        const gregorianYear = gregorianDate.getFullYear();
        const gregorianMonthIndex = gregorianDate.getMonth();
        const gregorianDay = gregorianDate.getDate();

        this.#year = gregorianYear + 10000;
        this.#dayOfYear = (Date.UTC(gregorianYear, gregorianMonthIndex, gregorianDay)
                         - Date.UTC(gregorianYear, 0, 1))
                         / 86_400_000;
    }

    get year() {
        return this.#year;
    }

    set year(newYear) {
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
        if (newDayOfYear >= this.numDaysInYear) {
            this.#year++;
            this.#dayOfYear = newDayOfYear - this.numDaysInYear;
        } else {
            this.#dayOfYear = newDayOfYear;
        }
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
