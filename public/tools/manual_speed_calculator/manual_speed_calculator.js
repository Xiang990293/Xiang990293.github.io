const distanceInput = document.getElementById('distance');
const distanceUnitSelect = document.getElementById('distanceUnit');
const timeUnitSelect = document.getElementById('timeUnit');
const startButton = document.getElementById('startButton');
const resultDiv = document.getElementById('result');
const ctx = document.getElementById('speedChart').getContext('2d');

let previousTime = null;
let previousSpeed = null;
let results = [];
let startTime = null;

// 初始化圖表
const speedChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // 時間標籤
        datasets: [{
            label: '速度 (公尺/秒)',
            data: [], // 速度數據
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: '時間 (秒)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: '速度 (公尺/秒)'
                }
            }
        }
    }
});

// 當距離單位改變時清空結果並重置
distanceUnitSelect.addEventListener('change', resetCalculator);

// 當時間單位改變時清空結果並重置
timeUnitSelect.addEventListener('change', resetCalculator);

function resetCalculator() {
    resultDiv.textContent = ''; // 清空結果
    results = []; // 重置結果陣列
    previousTime = null; // 重置之前的時間
    previousSpeed = null; // 重置之前的速度
    startTime = null;
    speedChart.data.labels = []; // 清空圖表標籤
    speedChart.data.datasets[0].data = []; // 清空圖表數據
    speedChart.update(); // 更新圖表
}

startButton.addEventListener('click', () => {
    const distance = parseFloat(distanceInput.value);
    const distanceUnit = distanceUnitSelect.value; // 取得距離單位
    const timeUnit = timeUnitSelect.value; // 取得速度單位

    if (isNaN(distance)) {
        resultDiv.textContent = '請輸入有效數字';
        return;
    }

    const currentTime = Date.now();

    if (previousTime) {
        const elapsedTime = (currentTime - previousTime) / 1000; // 秒
        
        let speed = distance * distanceUnit * timeUnit/ elapsedTime; // 公尺/秒

        results.push({ speed, totalTime: currentTime - startTime }); // 將速度和經過的時間儲存為物件
        
        // 只保留最近五次的結果
        if (results.length > 5) {
            results.shift();
        }
        
        const distanceUnitOptions = distanceUnitSelect.options;
        const timeUnitOptions = timeUnitSelect.options;
        const distanceUnitText = distanceUnitOptions[distanceUnitSelect.selectedIndex].text;
        const timeUnitText = timeUnitOptions[timeUnitSelect.selectedIndex].text;
        
        let speedDiffText = '';
        if (previousSpeed !== null) {
            const speedDiff = speed - previousSpeed;
            speedDiffText = `(較上次紀錄${speedDiff > 0 ? '快' : '慢'}${Math.abs(speedDiff).toFixed(2)} ${distanceUnitText}/${timeUnitText})`;
        }

        // 計算平均速度
        const averageSpeed = results.reduce((total, record) => total + record.speed, 0) / results.length;

        // 顯示結果
        let resultText = `本次速度: ${speed.toFixed(2)} ${distanceUnitText}/${timeUnitText} ${speedDiffText}<br>`;
        resultText += `最近五次紀錄:<br>`;

        // 顯示所有最近紀錄
        results.forEach((record, index) => {
            const totalTimeInSeconds = record.totalTime / 1000;
            resultText += `第${index + 1}次紀錄: 速度: ${record.speed.toFixed(2)} ${distanceUnitText}/${timeUnitText}，總時間: ${totalTimeInSeconds.toFixed(2)} 秒<br>`;
        });

        resultText += `最近五次平均速度: ${averageSpeed.toFixed(2)} ${distanceUnitText}/${timeUnitText}`;
        
        resultDiv.innerHTML = resultText;

        previousSpeed = speed; // 保存當前速度
        
        // 更新圖表數據
        speedChart.data.labels.push((currentTime - startTime) / 1000); // 將經過的時間（秒）作為標籤
        speedChart.data.datasets[0].data.push(speed); // 將當前速度添加到數據中
        speedChart.update(); // 更新圖表
    } else {
        startTime = currentTime;
        resultDiv.textContent = '再次點擊開始紀錄';
        
        // 初始化圖表數據
        speedChart.data.labels.push(0); // 初始時間為 0
        speedChart.data.datasets[0].data.push(0); // 初始速度為 0
        speedChart.update();
    }

    previousTime = currentTime;
    
    if (!startTime) {
    startTime = currentTime; // 初始化開始時間
}

});

function toggleInfo() {
    var infoText = document.querySelector('.info-text');
    infoText.style.display = (infoText.style.display === 'none') ? 'block' : 'none';
}

