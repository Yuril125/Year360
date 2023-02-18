export default class Year360Date {
    static weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    constructor(gregorianDate) {
        const gregorianYear = gregorianDate.getFullYear();
        const gregorianMonthIndex = gregorianDate.getMonth();
        const gregorianDay = gregorianDate.getDate();

        this.year = gregorianYear + 10000;
        this.dayOfYear = (Date.UTC(gregorianYear, gregorianMonthIndex, gregorianDay)
                        - Date.UTC(gregorianYear, 0, 1))
                        / 86400000;
    }

    get year() {
        return this.dayOfYear;
    }
}
