/* 
	credit to https://npm.io/package/pi-calculator
	for the spigot algorithm of pi
*/

function* pi() {
	let q = 1n;
	let r = 180n;
	let t = 60n;
	let i = 2n;

	while (true) {
		let digit = ((i * 27n - 12n) * q + r * 5n) / (t * 5n);

		yield Number(digit);

		let u = i * 3n;
		u = (u + 1n) * 3n * (u + 2n);
		r = u * 10n * (q * (i * 5n - 2n) + r - t * digit);
		q *= 10n * i * (i++ * 2n - 1n);
		t *= u;
	}
}

module.exports = (root) => {
	let gen = pi();
	let t = 0;
	let pi_cache = [];

	gen.next().value; // 跳過整數部分3

	function calculateAsync(digit) {
		return new Promise((resolve) => {
			function step() {
				const batchSize = 1000; // 每批計算1000位
				let count = 0;
				while (t < digit && count < batchSize) {
					pi_cache.push(gen.next().value);
					t++;
					count++;
				}

				if (t < digit) {
					setImmediate(step); // 非同步下一批
				} else {
					resolve(pi_cache[digit-1]); // 計算完成回傳結果切片
				}
			}
			
			if (digit <= t) {
				resolve(pi_cache[digit-1]); // 已經計算過，直接回傳結果切片
				return;
			}

			step();
		});
	}

	return { pi_calculate: calculateAsync };
};
