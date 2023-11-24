var title = document.getElementById("title")
title.innerHTML = "麥快研究團隊 - 工具";
var btitle = document.getElementsByClassName("big-title")[0]
btitle.innerHTML = "工具 - 合成路徑圖";
var subtitle = document.getElementById("subtitle")
subtitle.innerHTML = "顯示所有可合成的配方";

var offset_mx, offset_my;
function drag(event) {
	const rect = event.target.getBoundingClientRect();
	dragOffsetX = event.clientX - rect.left;
	dragOffsetY = event.clientY - rect.top;
	event.dataTransfer.setData("text", event.target.id);
}

function getHighestZIndex() {
    const nodes = document.querySelectorAll(".node");
    let maxIndex = 0;
    nodes.forEach(node => {
        const zIndex = parseInt(window.getComputedStyle(node).zIndex);
        maxIndex = Math.max(maxIndex, zIndex || 0);
    });
    return maxIndex;
}

function updateConnection(line, x1, y1, x2, y2) {
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
	line.setAttribute("marker-end", "url(#arrow)");
}

document.addEventListener("dragover", function(event) {
	event.preventDefault();
});

document.addEventListener("drop", function(event) {
	event.preventDefault();
	const data = event.dataTransfer.getData("text");
	const draggedNode = document.getElementById(data);
	const chartContainer = document.getElementById("chart-container");

	const rect = chartContainer.getBoundingClientRect();
	const offsetX = event.clientX - rect.left - dragOffsetX;
	const offsetY = event.clientY - rect.top - dragOffsetY;

	draggedNode.style.left = offsetX + "px";
	draggedNode.style.top = offsetY + "px";

	draggedNode.style.zIndex = getHighestZIndex() + 1;
	
	const movedNodeId = draggedNode.id;

    // Get all lines connected to the moved node
    const connectedLines = document.querySelectorAll(`.connection[data-start-node="${movedNodeId}"], .connection[data-end-node="${movedNodeId}"]`);
	
	connectedLines.forEach(path => {
        const startNode = document.getElementById(path.dataset.startNode);
        const endNode = document.getElementById(path.dataset.endNode);
		// const rect1 = startNode.getBoundingClientRect();
		// const rect2 = endNode.getBoundingClientRect();
		const startX = getCenterX(startNode);
		const startY = getCenterY(startNode);
		const endX = getCenterX(endNode);
		const endY = getCenterY(endNode);
		const midX = (startX + endX)/2;
		const midY = (startY + endY)/2;
		const d = `M ${startX},${startY} L ${midX},${midY} L ${endX},${endY}`;

		path.setAttribute("d", d);

        // Update line positions (you need to implement this function)
        // updateConnection(line, x1, y1, x2, y2);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const nodes = document.querySelectorAll(".node");

    nodes.forEach(node => {
        const nodeId = node.id;
        const imageName = nodeId + ".png"; // Assuming the image extension is .png

        // Set the background image of each node based on its ID
        node.style.backgroundImage = `url(./textures/block/${imageName})`;
        node.style.backgroundSize = "contain";
        node.style.backgroundPosition = "bottom";
        node.style.backgroundRepeat = "no-repeat";
    });
});

function getCenterX(element) {
    const rect = element.getBoundingClientRect();
    return rect.left + rect.width / 2;
}

function getCenterY(element) {
    const rect = element.getBoundingClientRect();
    return rect.top + rect.height / 2;
}

function connectNodes(rootNodeId, subNodeId) {
    const rootNode = document.getElementById(rootNodeId);
    const subNode = document.getElementById(subNodeId);

	const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const startX = getCenterX(rootNode);
    const startY = getCenterY(rootNode);
    const endX = getCenterX(subNode);
    const endY = getCenterY(subNode);
	const midX = (startX + endX)/2;
	const midY = (startY + endY)/2;
	const d = `M ${startX},${startY} L ${midX},${midY} L ${endX},${endY}`;

	svgPath.setAttribute("d", d);
	svgPath.setAttribute("style", "stroke: black; stroke-width:2");
	svgPath.setAttribute("min-height", "200px");
	svgPath.setAttribute("min-width", "200px");
	svgPath.setAttribute("data-start-node", rootNodeId);
	svgPath.setAttribute("data-end-node", subNodeId);
	svgPath.setAttribute("class", "connection");
	svgPath.setAttribute("marker-mid", "url(#arrow)");
	document.getElementById("connections-container").appendChild(svgPath);
}

// Call the connectNodes function with IDs of root and subnodes
connectNodes("oak_log", "oak_planks");
connectNodes("oak_log", "diamond_block");
connectNodes("oak_log", "node3");
connectNodes("oak_log", "node4");
// Add more connections as needed