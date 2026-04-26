// type PositiveOddNumberUnderTen = 1 | 3 | 5 | 7 | 9;
// function isPositiveOddNumberUnderTen(num: number): num is PositiveOddNumberUnderTen {
// 	console.log();
// 	return [1, 3, 5, 7, 9].includes(num)
// }
// console.log(isPositiveOddNumberUnderTen(3)); // true
// console.log(isPositiveOddNumberUnderTen(4)); // false
// console.log(isPositiveOddNumberUnderTen(11)); // false
function wrapInArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === "string") {
        if (value.includes("[")) {
            try {
                var parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
            catch (e) {
                return [value];
            }
        }
        if (value.includes(",")) {
            var parts = value.split(",");
            if (Array.isArray(parts)) {
                return parts;
            }
        }
    }
    return [value];
}
console.log("hello"[0]);
