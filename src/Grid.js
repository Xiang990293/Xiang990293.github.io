
import { dir } from 'i18next';
import { Direction } from 'mathquill-node';
import React, { useEffect, useState } from 'react';

console.log('Grid.js loaded')
// 假設每格物品種類與數量資料


const genre_color = {
    'building': '#0044ff',
    'colored': '#a200ff',
    'combat': '#ff6788',
    'edible': '#ff8800',
    'functional': '#ffff00',
    'ingredients': '#fff7b0',
    'natural': '#116800',
    'redstone': '#ff0000',
    'tools': '#666666'
};

const genre_chinese = {
    'building': "建築",
    'colored': "彩色",
    'combat': "戰鬥",
    'edible': "飲食",
    'functional': "功能",
    'ingredients': "材料",
    'natural': "自然",
    'redstone': "紅石",
    'tools': "工具",
}

export default function Grid() {
    const [topLeftCoor, setTopLeftCoor] = useState(null);
    const [items, setItems] = useState([]);
    const [hoverInfo, setHoverInfo] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // 新增搜尋文字 state

    useEffect(() => {
        fetch('/rippou-ripple-server/survival/query/inventory_data')
            .then(response => response.json())
            .then(data => {
                data = JSON.parse(data);

                setTopLeftCoor(data["root"]);
                setItems(data["Items"]);
            })
            .catch(error => {
                console.error('Error fetching inventory data:', error);
            });
    }, []);

    const handleMouseEnter = (cell) => {
        setHoverInfo(cell);
    };

    const handleMouseLeave = () => {
        setHoverInfo(null);
    };

    const baseSize = 5;
    const enlargedSize = 10;
    const width = 136 * baseSize;
    const height = 136 * baseSize;

    // 依關鍵字過濾顯示的物品
    const filteredItems = items.filter(item => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true; // 沒有輸入就顯示全部
        return (
            item.id.includes(query) ||
            genre_chinese[item.genre].includes(query) ||
            item.item.includes(query)
        );
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
                type="text"
                placeholder="搜尋物品名稱或類別"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ marginBottom: '10px', padding: '5px', width: '200px', fontSize: '16px' }}
                />
            <svg width={width} height={height} style={{ border: '1px solid black' }}>
                {/* 以下保留原有座標繪圖邏輯 */}
                <polygon style={{fill: "#ffd70080", stroke: "none"}} points="0,0 680,0 340,340"/>
                <polygon style={{fill: "#80808080", stroke: "none"}} points="0,0 0,680 340,340"/>
                <polygon style={{fill: "#00ffff80", stroke: "none"}} points="680,680 680,0 340,340"/>
                <polygon style={{fill: "#00ff0080", stroke: "none"}} points="680,680 0,680 340,340"/>
                <rect width="270" height="270" x="205" y="205" style={{fill: "white"}} />
                <rect width="340" height="340" x="170" y="170" style={{fill: "none", stroke: "white", strokeWidth: 5}}/>
                <rect width="540" height="540" x="70" y="70" style={{fill: "none", stroke: "white", strokeWidth: 5}}/>

                {filteredItems.map((item, idx) => {
                    const x = item.x - topLeftCoor.x;
                    const y = item.z - topLeftCoor.z;
                    const isHovered = hoverInfo === idx;
                    const size = isHovered ? enlargedSize : baseSize;
                    
                    return (
                        <rect
                        key={idx}
                        x={baseSize * x}
                        y={baseSize * y}
                        width={size}
                        height={size}
                        fill={genre_color[item.genre]}
                        stroke={isHovered ? 'white' : 'black'}
                        strokeWidth={0.5}
                        onMouseEnter={() => setHoverInfo(idx)}
                        onMouseLeave={() => setHoverInfo(null)}
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        />
                    );
                })}
            </svg>

            <div style={{
                position: 'fixed',
                top: "1vw",
                right: "1vw",
                width: "10vw",
                background: '#fff8',
                border: '1px solid #ddd',
                borderRadius: "1vw",
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                padding: "0.5vw",
                zIndex: 1000,
                pointerEvents: "none"
            }}>
                {hoverInfo !== null ? (
                    <>
                        <div style={{ fontWeight: 'bold' }}>物品詳細資訊</div>
                        <div>類別: {genre_chinese[filteredItems[hoverInfo].genre]}</div>
                        <div>名稱: {filteredItems[hoverInfo].item}</div>
                        <div>座標: ({filteredItems[hoverInfo].x}, {filteredItems[hoverInfo].z})</div>
                    </>
                ) : (
                    <div>將滑鼠移到方塊上查看詳細資訊</div>
                )}
            </div>
        </div>
                // <div style={{ display: 'flex' }}>
                //     <svg width={width} height={height} style={{ border: '1px solid black' }}>
                //         <polygon style={{fill: "#ffd70080", stroke: "none"}} points="0,0 680,0 340,340"/>
                //         <polygon style={{fill: "#80808080", stroke: "none"}} points="0,0 0,680 340,340"/>
                //         <polygon style={{fill: "#00ffff80", stroke: "none"}} points="680,680 680,0 340,340"/>
                //         <polygon style={{fill: "#00ff0080", stroke: "none"}} points="680,680 0,680 340,340"/>
                //         <rect width="270" height="270" x="205" y="205" style={{fill: "white"}} />
                //         <rect width="340" height="340" x="170" y="170" style={{fill: "none", stroke: "white", strokeWidth: 5}}/>
                //         <rect width="540" height="540" x="70" y="70" style={{fill: "none", stroke: "white", strokeWidth: 5}}/>
        
                //         {console.log(items)}
                //         {items.map((item, idx) => {
                //             const x = item.x - topLeftCoor.x;
                //             const y = item.z - topLeftCoor.z;
                //             const isHovered = hoverInfo === idx;
                //             const size = isHovered ? enlargedSize : baseSize;
        
                //             return (
                //                 <rect
                //                     key={idx}
                //                     x={baseSize * x}
                //                     y={baseSize * y}
                //                     width={size}
                //                     height={size}
                //                     fill={genre_color[item.genre]}
                //                     stroke={isHovered ? 'white' : 'black'}
                //                     strokeWidth={0.5}
                //                     onMouseEnter={() => setHoverInfo(idx)}
                //                     onMouseLeave={() => setHoverInfo(null)}
                //                     style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                //                 />
                //             );
                //         })}
                //     </svg>
        
                //     <div style={{
                //         position: 'fixed',
                //         top: "1vw",
                //         right: "1vw",
                //         width: "10vw",
                //         background: '#fff8',
                //         border: '1px solid #ddd',
                //         borderRadius: "1vw",
                //         boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                //         padding: "0.5vw",
                //         zIndex: 1000,
                //         pointerEvents: "none"
                //     }}>
                //         {hoverInfo !== null ? (
                //             <>
                //                 <div style={{ fontWeight: 'bold' }}>物品詳細資訊</div>
                //                 <div>類別: {genre_chinese[items[hoverInfo].genre]}</div>
                //                 <div>名稱: {items[hoverInfo].item}</div>
                //                 <div>座標: ({items[hoverInfo].x}, {items[hoverInfo].z})</div>
                //             </>
                //         ) : (
                //             <div>將滑鼠移到方塊上查看詳細資訊</div>
                //         )}
                //     </div>
                // </div>
    );
}