gameboard = [
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0]
]

gameboardTurn = [
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0]
]

function trun(){
	for (i = 0; i < gameboard.length; i++){
		for (j = 0; j < gameboard[0].length; j++){
			gameboardTurn[j][i] = gameboard[i][j];
		}
	}

	return gameboardTurn
}

(three = []).length = 50
three.fill(0)
three[0] = 3
function three(power){
	if(three[power]!=0) return three[power]
	else three[power] = 3*three(power-1)
	return three[power]
}

function reset(){
	gameboard = [
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0]
	]
}

function summon(){
	x = Math.ceil(10*Math.random())
	y = Math.ceil(10*Math.random())
	while(gameboard[y][x]!=0){
		x = Math.ceil(10*Math.random())
		y = Math.ceil(10*Math.random())
	}

	n = (Math.ceil(100*Math.random())>=90)?9:3
	gameboard[y][x] = n
}

function squeeze(mode){
	//up, down == 2, 3 | left, right == 0, 1
	for(i=0; i<gameboard.length; i++){
		fit = false
		for(j=0; j<gameboard.length; j++){
			fit = false
			if (i[j] === 0){
				continue
			}
			if (i[j] === three[49]){
				i[j] = 0
				continue
			}
			for(k=0; k<50; k++){
				if (i[j] === three(k) | i[j+1]^~i[j] === -1 | i[j+2]^~i[j] === -1 ){
					i[j] = 3*three(k+1)
					i[j+1]=0
					i[j+2]=0
					j+=2
					fit = true
					break
				}
			}
			if(fit===true) continue
		}
	}
}

document.addEventListener('keydown', function(event) {
	if (event.code === 'KeyW') {
		summon()
		console.log(gameboard)
	}
	if (event.code === 'KeyA') {
		left()
		summon()
		console.log(gameboard)
	}
	if (event.code === 'KeyS') {
		summon()
		console.log(gameboard)
	}
	if (event.code === 'KeyD') {
		summon()
		console.log(gameboard)
	}
});

function gamestart(){
	reset()
	summon()
}

gamestart()