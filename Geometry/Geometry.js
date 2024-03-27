
//manage geometry.

const Geometry = {

    init: function(...pos){
		if(pos.length <= 1){
			console.log('can make a geometry with less than 2 position.');
			return null;
		}
		if(pos.length == 2)
			return Line.init(pos[0], pos[1]);
		if(pos.length == 3)
			return Triangle.init(pos[0], pos[1], pos[2]);
	    return {
		    pos: pos,
			type: 'Geometry',
			fill: false,
		}
	},
	
	getArrayLinesFromGeometry: function(geometry, posBase=null, rotate=null, scale=null){
		
		posBase ||= Vector.init(0, 0);
		rotate ||= 0;
		scale = (scale == null? Vector.init(1, 1): Vector.initFrom(scale));
		//scale.y *= -1;
		rotate*= -1;
		
		switch(geometry.type){
			case('Rectangle'):
				return Rectangle.getArrayLinesFromRectangle(geometry, posBase, rotate, scale);
				break;
			case('Circle'):
				return Circle.getArrayLinesFromCircle(geometry, posBase, rotate, scale);
				break;
			case('Line'):
				return Line.getArrayLinesFromLine(geometry, posBase, rotate, scale);
				break;
			case('Triangle'):
				return Triangle.getArrayLinesFromTriangle(geometry, posBase, rotate, scale);
				break;
			case('Geometry'):
				
				let arrayLines = []; //cast geometry to lines.
				let poss = [];
				for(let i=0; i<geometry.pos.length; i++){
					poss.push(Vector.add(Vector.rotateAVector(Vector.multiply(geometry.pos[i], scale), rotate)), posBase);
				}
				for(let i=0; i<poss.length; i++){
					arrayLines.push(Line.init(poss[i], poss[(i+1)%poss.length]));
				}
				if(geometry.fill){
					for(let i=0; i<poss.length; i+=2){
						arrayLines.push(Line.init(poss[i], posBase));
					}
				}
				geometry.linesFromGeometry = arrayLines;
				return arrayLines;
				
				break;
		}
		
	},

};