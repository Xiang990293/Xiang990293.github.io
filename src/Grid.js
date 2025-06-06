
import { dir } from 'i18next';
import { Direction } from 'mathquill-node';
import React, { useEffect, useState } from 'react';

console.log('Grid.js loaded')
// 假設每格物品種類與數量資料


const genre = ['wood', 'color', 'stone', 'mineral', 'redstone', 'naturals', 'food', 'combat', 'ingridients', 'functionals', 'plants', 'void', 'none'];

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
                {console.log(items)}
                {items.map((item, idx) => {
                    const x = item.x - topLeftCoor.x;
                    const y = item.z - topLeftCoor.z;
                    const isHovered = hoverInfo === idx;
                    const size = isHovered ? enlargedSize : baseSize;

                    return (
                        <rect
                            key={idx}
                            x={x}
                            y={y}
                            width={size}
                            height={size}
                            fill={isHovered ? 'orange' : 'blue'}
                            stroke="black"
                            strokeWidth={0.5}
                            onMouseEnter={() => setHoverInfo(idx)}
                            onMouseLeave={() => setHoverInfo(null)}
                            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        />
                    );
                })}
            </svg>

            <div style={{ marginLeft: 20, minWidth: 200 }}>
                {hoverInfo !== null ? (
                    <>
                        <h3>物品詳細資訊</h3>
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