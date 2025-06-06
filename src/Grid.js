
import { dir } from 'i18next';
import { Direction } from 'mathquill-node';
import React, { useState } from 'react';

console.log('Grid.js loaded')

function coordToIndex(x, y) {
    /*
        x, and y are count from 1, not zero.
    */
    // 將二維座標轉換為一維索引
    return (y - 1) * 136 + x - 1;
}
// 假設每格物品種類與數量資料
let gridData = Array(136 * 136).fill(null); // third layer outer side
// gridData[coordToIndex(1, 1)] = gridData[coordToIndex(1, 136)] = gridData[coordToIndex(136, 1)] = gridData[coordToIndex(136, 136)] = { id: -1, type: 'void', count: -1, direction: "center" }; // no spaceat corner
// for (let x = 2; x < 136; x++) for (let y = 2; y < 136; y++)
//     gridData[coordToIndex(x, y)] = { id: -1, type: 'void', count: -1, direction: "center" }; // no space at aisle
// for (let x = 8; x < 136-8+2; x++) for (let y = 8; y < 136-8+2; y++)
//     gridData[coordToIndex(x, y)] = null; // third layer inner side
// for (let x = 9; x < 136-9+2; x++) for (let y = 9; y < 136-9+2; y++)
//     gridData[coordToIndex(x, y)] = { id: -1, type: 'void', count: -1, direction: "center" }; // no space at aisle
// for (let x = 21; x < 136-21+2; x++) for (let y = 21; y < 136-21+2; y++)
//     gridData[coordToIndex(x, y)] = null; // second layer outer side
// for (let x = 22; x < 136-22+2; x++) for (let y = 22; y < 136-22+2; y++)
//     gridData[coordToIndex(x, y)] = { id: -1, type: 'void', count: -1, direction: "center" }; // no space at aisle
// for (let x = 28; x < 136-28+2; x++) for (let y = 28; y < 136-28+2; y++)
//     gridData[coordToIndex(x, y)] = null; // second layer inner side
// for (let x = 29; x < 136-29+2; x++) for (let y = 29; y < 136-29+2; y++)
//     gridData[coordToIndex(x, y)] = { id: -1, type: 'void', count: -1, direction: "center" }; // no space at aisle
// for (let x = 41; x < 136-41+2; x++) for (let y = 41; y < 136-41+2; y++)
//     gridData[coordToIndex(x, y)] = null; // first layer outer side
// for (let x = 42; x < 136-42+2; x++) for (let y = 42; y < 136-42+2; y++)
//     gridData[coordToIndex(x, y)] = { id: -1, type: 'void', count: -1, direction: "center" }; // no space at aisle
// for (let y = 2; y < 136; y++) for (let x = 65; x < 73; x++)
//     if (y <= 41) gridData[coordToIndex(x, y)] = { id: -1, type: 'void', count: -1, direction: "north" }; // no space at aisle
//     else if (y >= 96) gridData[coordToIndex(x, y)] = { id: -1, type: 'void', count: -1, direction: "south" }; // no space at aisle
//     else continue;
// for (let x = 2; x < 136; x++) for (let y = 65; y < 73; y++)
//     if (x <= 41) gridData[coordToIndex(x, y)] = { id: -1, type: 'void', count: -1, direction: "west" }; // no space at aisle
//     else if (x >= 96) gridData[coordToIndex(x, y)] = { id: -1, type: 'void', count: -1, direction: "east" }; // no space at aisle
//     else continue;


// .map((_, i) => ({
//     id: i,
//     type: ['red', 'green', 'blue'][i % 3], // 模擬三種顏色種類
//     count: Math.floor(Math.random() * 10) + 1,
// }));

const genre = ['wood', 'color', 'stone', 'mineral', 'redstone', 'naturals', 'food', 'combat', 'ingridients', 'functionals', 'plants', 'void', 'none'];

export default function Grid() {
    const [hoverInfo, setHoverInfo] = useState(null);


    const handleMouseEnter = (cell) => {
        setHoverInfo(cell);
    };

    const handleMouseLeave = () => {
        setHoverInfo(null);
    };

    return (
        <>
            {/* 固定顯示區域 */}
            <div className="info-panel">
                {hoverInfo ? (
                    <>
                        <p>物品: {hoverInfo.type}</p>
                        <p>數量: {hoverInfo.count}</p>
                    </>
                ) : (
                    <p>請將滑鼠移至格子</p>
                )}
            </div>

            {/* 格子容器 */}
            <div className="grid-container">
                {gridData.map(cell => (
                    <div
                        key={cell.id}
                        className={`grid-cell ${cell.type}`}
                        onMouseEnter={() => handleMouseEnter(cell)}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}
            </div>
        </>
    );
}