export const sortFunction = (a, b) => {
    if ((typeof a === "number") & (typeof b === "number")) {
        return a - b;
    } else {
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
    }
};

export const addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};