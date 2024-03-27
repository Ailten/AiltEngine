
//manage line.

const Line = {

    init: function(posStart, posEnd){
	    return {
		    posStart: posStart,
			posEnd: posEnd,
			type: 'Line',
		}
	},
	
	getArrayLinesFromLine: function(geometry, posBase=null, rotate=null, scale=null){
		
		posBase ||= Vector.init(0, 0);
		rotate ||= 0;
		scale ||= Vector.init(1, 1);
		
		let arrayLines = []; //cast geometry to lines.
		arrayLines.push(Line.init(
			Vector.add(Vector.rotateAVector(Vector.multiply(geometry.posStart, scale), rotate), posBase),
			Vector.add(Vector.rotateAVector(Vector.multiply(geometry.posEnd, scale), rotate), posBase)
		));
		geometry.linesFromGeometry = arrayLines;
		return arrayLines;
		
	},

};