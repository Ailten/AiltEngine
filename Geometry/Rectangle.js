
//manage rectangle.

const Rectangle = {

    init: function(posUpLeft, posDownRight, fill=false){
	    return {
		    posUpLeft: posUpLeft,
			posDownRight: posDownRight,
			type: 'Rectangle',
			fill: fill,
		}
	},
	
	getArrayLinesFromRectangle: function(geometry, posBase=null, rotate=null, scale=null){
		
		posBase ||= Vector.init(0, 0);
		rotate ||= 0;
		scale ||= Vector.init(1, 1);
		
		let arrayLines = []; //cast geometry to lines.
		let poss = [
			Vector.add(Vector.rotateAVector(Vector.multiply(geometry.posUpLeft, scale), rotate), posBase),
			Vector.add(Vector.rotateAVector(Vector.multiply(Vector.init(geometry.posDownRight.x, geometry.posUpLeft.y), scale), rotate), posBase),
			Vector.add(Vector.rotateAVector(Vector.multiply(geometry.posDownRight, scale), rotate), posBase),
			Vector.add(Vector.rotateAVector(Vector.multiply(Vector.init(geometry.posUpLeft.x, geometry.posDownRight.y), scale), rotate), posBase)
		];
		arrayLines.push(Line.init(poss[0], poss[1]));
		arrayLines.push(Line.init(poss[1], poss[2]));
		arrayLines.push(Line.init(poss[2], poss[3]));
		arrayLines.push(Line.init(poss[3], poss[0]));
		if(geometry.fill){
			arrayLines.push(Line.init(poss[0], poss[2]));
			arrayLines.push(Line.init(poss[1], poss[3]));
		}
		geometry.linesFromGeometry = arrayLines;
		return arrayLines;
		
	},

};