const distanceInput = document.getElementById('distance');
const distanceUnitSelect = document.getElementById('distanceUnit');
const timeUnitSelect = document.getElementById('timeUnit');
const startButton = document.getElementById('startButton');
const resultDiv = document.getElementById('result');

let previousTime = null;
let results = [];

startButton.addEventListener('click', () => {
    const distance = parseFloat(distanceInput.value);
    const distanceUnit = distanceUnitSelect.value; // 取得距離單位
    const timeUnit = timeUnitSelect.value; // 取得速度單位

    if (isNaN(distance)) {
        resultDiv.textContent = '請輸入有效數字';
        return;
    }

    const currentTime = Date.now();
    resultDiv.textContent = previousTime;

    if (previousTime) {
        resultDiv.textContent += " "+currentTime;
        
        const elapsedTime = (currentTime - previousTime) / 1000; // 秒
        
        let speed = distance * distanceUnit * timeUnit/ elapsedTime; // 公尺/秒

        results.push(speed);

        // 只保留最近五次的結果
        if (results.length > 5) {
            results.shift();
        }

        // 計算平均值
        const average = results.reduce((total, speed) => total + speed, 0) / results.length;
        
        const distanceUnitOptions = distanceUnitSelect.options;
        const timeUnitOptions = timeUnitSelect.options;
        const distanceUnitText = distanceUnitOptions[distanceUnitSelect.selectedIndex].text;
        const timeUnitText = timeUnitOptions[timeUnitSelect.selectedIndex].text;
        
        resultDiv.textContent = `
            速度: ${speed.toFixed(2)} ${distanceUnitText}/${timeUnitText}
            最近五次平均: ${average.toFixed(2)} ${distanceUnitText}/${timeUnitText}
        `;
    }

    previousTime = currentTime;
});
