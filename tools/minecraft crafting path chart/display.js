var title = document.getElementById("title")
title.innerHTML = "麥快研究團隊 - 工具";
var btitle = document.getElementsByClassName("big-title")[0]
btitle.innerHTML = "工具 - 合成路徑圖";
var subtitle = document.getElementById("subtitle")
subtitle.innerHTML = "顯示所有的配方";

var dragOffsetX, dragOffsetY;
function drag(event) {
	dragOffsetX = event.clientX;
	dragOffsetY = event.clientY;
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

function move_path(mode, movedNodeId){
	var connectedLines
	if(mode == "all"){
		connectedLines = document.querySelectorAll(`.connection`);
	}else if(mode == "only"){
		connectedLines = document.querySelectorAll(`.connection[data-start-node="${movedNodeId}"], .connection[data-end-node="${movedNodeId}"]`);
	}
	
	connectedLines.forEach(path => {
		const startNode = document.getElementById(path.dataset.startNode);
		const endNode = document.getElementById(path.dataset.endNode);
		
		const startX = getCenterX(startNode);
		const startY = getCenterY(startNode);
		const endX = getCenterX(endNode);
		const endY = getCenterY(endNode);
		const midX = (startX + endX)/2;
		const midY = (startY + endY)/2;
		const d = `M ${startX},${startY} L ${midX},${midY} L ${endX},${endY}`;

		path.setAttribute("d", d);
	});
}

window.addEventListener('resize', () => {
    move_path("all", "")
});

let zoomLevel = 1.0; // Initial zoom level
// Add event listener to the chart container for mouse wheel scrolling
document.getElementById('chart-container').addEventListener('wheel', event => {
	event.preventDefault();
	const delta = event.deltaY;
    let newZoomLevel = zoomLevel;

    // Adjust zoom level based on scroll direction
    if (delta > 0) newZoomLevel -= 0.1; // Zoom out
	else newZoomLevel += 0.1; // Zoom in

    // Set limits to the zoom level to prevent extreme scaling
    if (newZoomLevel < 0.5) newZoomLevel = 0.5;
    else if (newZoomLevel > 3.0) newZoomLevel = 3.0;

    // Apply the zoom level to the chart
    document.getElementById('chart-container').style.transform = `scale(${newZoomLevel})`;
	move_path("all", "");

	const nodes = document.querySelectorAll('.node');
        
	// Move all nodes by the calculated delta
	// nodes.forEach(node => {
	// 	node.style.width = `${75 / zoomLevel}px`;
	// 	node.style.height = `${75 / zoomLevel}px`;
	// });

    // Update the current zoom level
    zoomLevel = newZoomLevel;
});

var isDragging, initialMouseX, initialMouseY;
document.addEventListener('mousedown', function(event) {
    const clickedElement = event.target;

    // Check if the clicked element is the chart container
    if (clickedElement.id === 'chart-container') {
        isDragging = true;
        initialMouseX = event.clientX;
        initialMouseY = event.clientY;
    }
});

document.addEventListener('mousemove', function(event) {
    if (isDragging) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const deltaX = mouseX - initialMouseX;
        const deltaY = mouseY - initialMouseY;

        // Get all nodes
        const nodes = document.querySelectorAll('.node');
        
        // Move all nodes by the calculated delta
        nodes.forEach(node => {
            const left = parseInt(node.style.left || '0');
            const top = parseInt(node.style.top || '0');
            node.style.left = (left + deltaX / zoomLevel) + 'px';
            node.style.top = (top + deltaY / zoomLevel) + 'px';
        });

		move_path("all", "")

        // Update initial mouse position for the next move
        initialMouseX = mouseX;
        initialMouseY = mouseY;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener("dragstart", event => {
	const node = event.target; // Get the node being dragged

    const offsetX = event.offsetX || event.clientX - node.getBoundingClientRect().left;
    const offsetY = event.offsetY || event.clientY - node.getBoundingClientRect().top;

    const img = new Image();
	console.log(img)

    img.onload = function() {
		console.log("hi")
        const canvas = document.createElement('canvas');
		document.body.append(canvas);
        const ctx = canvas.getContext('2d');

        canvas.width = img.width * zoomLevel;
        canvas.height = img.height * zoomLevel;
        ctx.scale(zoomLevel, zoomLevel);
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

        event.dataTransfer.setDragImage(canvas, offsetX, offsetY);

        // Cleanup: Remove the canvas after the drag operation
        // setTimeout(() => {
        //     canvas.remove();
        // }, 0);
    };

	console.log("first")
    // Set the source of the image to the node's background image
    img.src = `./textures/block/${node.id}.png`;
    
    // Prevent default to enable dragging
    // event.preventDefault();
});

document.addEventListener("dragover", event => {
	event.preventDefault();
});

document.addEventListener("drop", function(event) {
	event.preventDefault();
	const data = event.dataTransfer.getData("text");
	const draggedNode = document.getElementById(data);
	const chartContainer = document.getElementById("chart-container");

	const rect = chartContainer.getBoundingClientRect();
	
	const offsetX = (event.clientX - dragOffsetX) / zoomLevel + Number(draggedNode.style.left.substring(0,draggedNode.style.left.length-2));
	const offsetY = (event.clientY - dragOffsetY) / zoomLevel + Number(draggedNode.style.top.substring(0,draggedNode.style.top.length-2));

	draggedNode.style.left = offsetX + "px";
	draggedNode.style.top = offsetY + "px";

	draggedNode.style.zIndex = getHighestZIndex() + 1;
	
	const movedNodeId = draggedNode.id;

    // Get all lines connected to the moved node
    move_path("only", movedNodeId)
});

document.addEventListener("DOMContentLoaded", function() {
	fetch('./chart.json')
		.then(response => response.json())
        .then(data => {
            // Access the loaded data and use it to create nodes and paths for your chart

            // Access nodes data
            const nodes = data.nodes;

            // Access paths data
            const paths = data.paths;

            // Use nodes and paths data to create your chart elements
            nodes.forEach(node => {
				const nodeId = node.id;
				const imageName = nodeId + ".png"; // Assuming the image extension is .png

				// Add a new node using innerHTML
				document.getElementById("chart-container").innerHTML += `<button class="node" draggable="true" ondragstart="drag(event)" id="${nodeId}" style="left: ${node.position.x}px; top: ${node.position.y}px;"></button>`;
				
				// Set the background image of each node based on its ID
				var node_html = document.getElementById(nodeId)
				node_html.style.backgroundImage = `url(./textures/block/${imageName})`;
				node_html.style.backgroundSize = "contain";
				node_html.style.backgroundPosition = "bottom";
				node_html.style.backgroundRepeat = "no-repeat";
				// node_html.style.top = "no-repeat";
			});
            paths.forEach(path => {
				connectNodes(path.startNodeId, path.endNodeId);
			});
        })
        .catch(error => {
            console.error('Error fetching data:', error);
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
// Add more connections as needed