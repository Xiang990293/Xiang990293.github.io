// type PositiveOddNumberUnderTen = 1 | 3 | 5 | 7 | 9;

// function isPositiveOddNumberUnderTen(num: number): num is PositiveOddNumberUnderTen {
// 	console.log();
// 	return [1, 3, 5, 7, 9].includes(num)
// }

// console.log(isPositiveOddNumberUnderTen(3)); // true
// console.log(isPositiveOddNumberUnderTen(4)); // false
// console.log(isPositiveOddNumberUnderTen(11)); // false

function wrapInArray<T>(value: T | T[]): T[] {
	if (Array.isArray(value)) {
		return value;
	}

	if (typeof value === "string") {

		if (value.includes("[")) {
			try {
				const parsed = JSON.parse(value);
				if (Array.isArray(parsed)) {
					return parsed as T[];
				}
			} catch (e) {
				return [value] as T[];
			}
		}

		if (value.includes(",")) {
			const parts = value.split(",");
			if (Array.isArray(parts)) {
				return parts as T[];
			}
		}
	}

	return [value] as T[];
}

console.log("hello"[0]);