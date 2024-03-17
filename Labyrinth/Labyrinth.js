
//Labyrinth management.

const Labyrinth = {
	
	//typeCells: [
	//	'border', //border of labyrinth.
	//	'room', //room (walkable).
	//	'center', //wall solid (never see from inner labyrinth).
	//	'wall', //wall between two room.
	//	'path' //path between two room.
	//],

	//generate an array 2D of cells (labyrinth procedural).
	init: function(sizeLabyrinth) {
		
		// --- step1.
		let sizeNWall = Vector.init( //size of labyrinth (rooms+walls).
			sizeLabyrinth.x * 2 + 1,
			sizeLabyrinth.y * 2 + 1
		);
		
		var grid = []; //array 2D fill (of object).
		for(let y=0; y<sizeNWall.y; y++){
			grid.push([]); //push a new line in row array.
			for(let x=0; x<sizeNWall.x; x++){
				if(x%2 != 0 && y%2 != 0) //add room.
					grid[y].push({type: 'room', idRng: null});
				else if(x%(sizeNWall.x-1) == 0 || y%(sizeNWall.y-1) == 0) //add border.
					grid[y].push({type: 'border', idRng: null});
				else if(x%2 == 0 && y%2 == 0) //add center.
					grid[y].push({type: 'center', idRng: null});
				else //add wall.
					grid[y].push({type: 'wall', idRng: null});
			}
		}
		
		// --- step2.
		let arrayNumberSend = [];
		for(let y=0; y<grid.length; y++){
			for(let x=0; x<grid[0].length; x++){
				if(grid[y][x].type != 'room')
					continue; //take only room.
			
				let randNum;
				do{ //get a random number not already assigned to a room.
					randNum = Math.rng(0,
						(grid.length * grid[0].length)-1
					); //set a bigger range than room count.
				}while(arrayNumberSend.includes(randNum));
					
				grid[y][x].idRng = randNum; //set the id.
				arrayNumberSend.push(randNum); //stock id send.
			}
		}
		
		// --- step3.
		while(true){
		
			let randWall = Vector.init( //random cell in grid.
				Math.rng(0, grid[0].length -1),
				Math.rng(0, grid.length -1)
			);
			if(grid[randWall.y][randWall.x].type != 'wall')
				continue; //skip if not a wall.
			
			let roomOne = Vector.initFrom(randWall); //position cell of both room join by the wall.
			let roomTwo = Vector.initFrom(randWall);
			if(randWall.x%2 == 0){ //is a vertical wall.
				roomOne.x -= 1;
				roomTwo.x += 1;
			}else{ //is an horizontal wall.
				roomOne.y -= 1;
				roomTwo.y += 1;
			}
			
			let roomOneId = grid[roomOne.y][roomOne.x].idRng; //get both idRng.
			let roomTwoId = grid[roomTwo.y][roomTwo.x].idRng;
			
			if(roomOneId == roomTwoId) //if the two room have the same id.
				continue; //skip, (the two room is already connected).
				
			//cast/replace object wall by an object path.
			grid[randWall.y][randWall.x] = {type: 'path', idRng: null};
			
			let isStayOnLoop = false; //default, expect exit the loop.
			for(let y=0; y<grid.length; y++){
				for(let x=0; x<grid[0].length; x++){
					if(grid[y][x].type != 'room')
						continue; //take only room.
					
					if(grid[y][x].idRng == roomTwoId) //if id equal idTwo.
						grid[y][x].idRng = roomOneId; //replace by idOne.
					
					if(grid[y][x].idRng != roomOneId) //if find a room with dif number.
						isStayOnLoop = true; //stay on loop, need to break other wall.
					
				}
			}
			if(!isStayOnLoop)
				break;
		
		}
		
		// --- end.
		return grid;
	
	},
	
	//path finding on a grid labyrinth.
	pathFinding: function(grid, posStart, posEnd){
		
		let startCell = { //choose a room to start.
			parent: null,
			pos: Vector.initFrom(posStart),
			g: 0, h: 0, f: 0,
		};
		let endCell = { //choose a room to end.
			parent: null,
			pos: Vector.initFrom(posEnd),
			g: 0, h: 0, f: 0,
		};
		
		let openList = [startCell]; //build list 
		let closedList = [];
		
		let pathFind = [];
		while(openList.length > 0){ //loop until openList was empty.
		
			let currentCell = openList[0]; //find the lowest f score.
			let currentIndex = 0;
			for(let index=0; index<openList.length; index++){
				let item = openList[index];
				if(item.f < currentCell.f){
					currentCell = item;
					currentIndex = index;
				}
			}
			
			openList.splice(currentIndex, 1); //pop/push the find cell.
			closedList.push(currentCell);
			
			if(currentCell.pos.x == endCell.pos.x && currentCell.pos.y == endCell.pos.y){
				pathFind = [];
				let current = currentCell;
				while(current != null){
					pathFind.push(current.pos);
					current = current.parent;
				}
				for(let i=0; i<Math.floor(pathFind.length/2); i++){ //reverce path.
					let swipCellPath = pathFind[i];
					pathFind[i] = pathFind[pathFind.length-1-i];
					pathFind[pathFind.length-1-i] = swipCellPath;
				}
				break; //exit loop while (return success).
			}
			
			let children = [];
			let adjacentCell = [Vector.init(0, -1), Vector.init(1, 0), Vector.init(0, 1), Vector.init(-1, 0)];
			for(let i=0; i<adjacentCell.length; i++){
				let newPos = adjacentCell[i];
				let cellPos = Vector.init(currentCell.pos.x + newPos.x, currentCell.pos.y + newPos.y);
				
				if(cellPos.x < 0 || cellPos.x > grid[0].length-1 || //skip if out of range.
					cellPos.y < 0 || cellPos.y > grid[0].length-1)
					continue;
					
				let getCell = grid[cellPos.y][cellPos.x];
				if(getCell.type == 'border' || getCell.type == 'wall' || getCell.type == 'center') //skip cell block.
					continue;
				
				children.push({ //push in children.
					parent: currentCell,
					pos: cellPos,
					g: 0, h: 0, f: 0,
				});
					
			}
			
			for(let i=0; i<children.length; i++){
				let child = children[i];
				
				let findMatchContinue = false;
				for(let j=0; j<closedList.length; j++){
					let closedChild = closedList[j];
					if(child.pos.x === closedChild.pos.x && child.pos.y === closedChild.pos.y){
						findMatchContinue = true;
						continue;
					}
				}
				if(findMatchContinue)
					continue;
				
				child.g = currentCell.g + 1;
				child.h = Math.pow(child.pos.x - endCell.pos.x, 2) + Math.pow(child.pos.y - endCell.pos.y, 2);
				child.f = child.g + child.h;
				
				for(let j=0; j<openList.length; j++){
					let openCell = openList[j];
					if(child.pos.x === openCell.pos.x && child.pos.y === openCell.pos.y && child.g > openCell.g){
						findMatchContinue = true;
						continue;
					}
				}
				if(findMatchContinue)
					continue;
				
				openList.push(child);
				
			}
		
		}
		
		return pathFind;
		
	}

};