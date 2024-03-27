
//manage triangle.

const Triangle = {

    init: function(posA, posB, posC, fill=false){
	    return {
		    posA: posA,
			posB: posB,
			posC: posC,
			type: 'Triangle',
			fill: fill,
		}
	},
	
	getArrayLinesFromTriangle: function(geometry, posBase=null, rotate=null, scale=null){
		
		posBase ||= Vector.init(0, 0);
		rotate ||= 0;
		scale ||= Vector.init(1, 1);
		
		let arrayLines = []; //cast geometry to lines.
		let poss = [
			Vector.add(Vector.rotateAVector(Vector.multiply(geometry.posA, scale), rotate), posBase),
			Vector.add(Vector.rotateAVector(Vector.multiply(geometry.posB, scale), rotate), posBase),
			Vector.add(Vector.rotateAVector(Vector.multiply(geometry.posC, scale), rotate), posBase)
		];
		arrayLines.push(Line.init(poss[0], poss[1]));
		arrayLines.push(Line.init(poss[1], poss[2]));
		arrayLines.push(Line.init(poss[2], poss[0]));
		if(geometry.fill){
			arrayLines.push(Line.init(poss[0], posBase));
			arrayLines.push(Line.init(poss[1], posBase));
			arrayLines.push(Line.init(poss[2], posBase));
		}
		geometry.linesFromGeometry = arrayLines;
		return arrayLines;
		
	},

};