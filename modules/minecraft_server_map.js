const fs = require('fs');

module.exports = (root) => {
    console.log("正在載入 minecraft_server_map...");
    const toroot = require('./toroot.js')(root);
    const dbDir = process.env.DATABASE_PATH;
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir);
    }

    console.log("已載入 minecraft_server_map")

    function upload_map(map_name, map_data) {
        // 處理上傳的地圖數據
        console.log(`正在上傳地圖：${map_name}`);
        // 這裡可以添加實際的上傳邏輯，例如將地圖數據存儲到資料庫或文件系統中
        
        try {
            fs.mkdirSync(`${dbDir}/rippou-ripple-server/survival`, { recursive: true });
            fs.writeFileSync(`${dbDir}/rippou-ripple-server/survival/${map_name}.json`, JSON.stringify(map_data, null, 2), 'utf8')
            console.log(`地圖 ${map_name} 已成功上傳`);
        } catch (err) {
            console.error('上傳地圖時發生錯誤：', err.message);
        }
    }

    function get_map(map_name) {
        // 獲取上傳的地圖數據
        console.log(`獲取地圖：${map_name}`);
        try {
            const map_data = fs.readFileSync(`${dbDir}/rippou-ripple-server/survival/${map_name}.txt`, 'utf8');
            return map_data;
        } catch (err) {
            console.error('獲取地圖時發生錯誤：', err.message);
            return null;
        }
    }

    return {
        upload_map,
        get_map
    }
}