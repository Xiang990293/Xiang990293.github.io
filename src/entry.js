import React from 'react';
import { createRoot } from 'react-dom/client';
import Grid from './Grid';
// import MathInput from './MathInput';


// 掛載 Grid
const gridContainer = document.getElementById('grid-root');
if (gridContainer) {
  const gridRoot = createRoot(gridContainer);
  gridRoot.render(<Grid />);
}

// // 掛載 MathInput
// const mathInputContainers = document.querySelectorAll('.mathinput-root');
// mathInputContainers.forEach(container => {
//   const mathInputRoot = createRoot(container);
//   mathInputRoot.render(<MathInput />);
// });