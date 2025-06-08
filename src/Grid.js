
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

    useEffect(() => {
        fetch('/rippou-ripple-server/survival/query/inventory_data')
            .then(response => response.json())
            .then(data => {
                data = JSON.parse(data);
                console.log(typeof data);

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

    return (
        <div style={{ display: 'flex' }}>
            <svg width={width} height={height} style={{ border: '1px solid black' }}>
<polygon style='fill: gray; stroke: none' points="0,0 680,0 340,340"/>
<polygon style='fill: aqua; stroke: none' points="0,0 0,680 340,340"/>
<polygon style='fill: lime; stroke: none' points="680,680 680,0 340,340"/>
<polygon style='fill: gold; stroke: none' points="680,680 0,680 340,340"/>
<rect width="270" height="270" x="164" y="164" style='fill: white' />
<rect width="340" height="340" x="170" y="170" style='fill: none; stroke: white; stroke-width: 5px'/>
<rect width="530" height="530" x="75" y="75" style='fill: none; stroke : white; stroke-width: 5px'/>

                {console.log(items)}
                {items.map((item, idx) => {
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
                top: 40,
                right: 40,
                width: 220,
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                padding: 16,
                zIndex: 1000
            }}>
                {hoverInfo !== null ? (
                    <>
                        <h3>物品詳細資訊</h3>
                        <p>類別: {genre_chinese[items[hoverInfo].genre]}</p>
                        <p>名稱: {items[hoverInfo].item}</p>
                        <p>座標: ({items[hoverInfo].x}, {items[hoverInfo].z})</p>
                    </>
                ) : (
                    <p>將滑鼠移到方塊上查看詳細資訊</p>
                )}
            </div>
        </div>
    );
}