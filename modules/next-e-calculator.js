function* euler() {
	let factorial = 1n
	let counter = 1n
	let result = 1n

	while (true) {
		factorial *= counter++; // 計算 n!，每次乘上下一個數字

		// 計算當前項為 (10^20) / n!
		result += (1n / factorial);

		// yield sum 轉為字串或數字呈現
		yield result.toString()[Number(counter)-1] || 0; // 如果超過長度，回傳 0
	}
}


module.exports = (root) => {
	let gen = euler();
	let t = 0;
	let e_cache = [];

	gen.next().value; // 跳過整數部分3

	function calculateAsync(digit) {
		return new Promise((resolve) => {
			function step() {
				const batchSize = 1000; // 每批計算1000位
				let count = 0;
				while (t < digit && count < batchSize) {
					e_cache.push(gen.next().value);
					t++;
					count++;
				}

				if (t < digit) {
					setImmediate(step); // 非同步下一批
				} else {
					resolve(e_cache[digit - 1]); // 計算完成回傳結果切片
				}
			}

			if (digit <= t) {
				resolve(e_cache[digit - 1]); // 已經計算過，直接回傳結果切片
				return;
			}

			step();
		});
	}

	return { e_calculate: calculateAsync };
};
