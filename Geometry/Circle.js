
//manage circle.

const Circle = {

    init: function(pos, rayon, fill=false) {
	    return {
			pos: pos,
			rayon: rayon,
			type: 'Circle',
			fill: fill,
		}
	},
	
	getArrayLinesFromCircle: function(geometry, posBase=null, rotate=null, scale=null){
		
		posBase ||= Vector.init(0, 0);
		rotate ||= 0;
		scale ||= Vector.init(1, 1);
		
		let arrayLines = []; //cast geometry to lines.
		let poss = [
			Vector.init(0, 1),
			Vector.init(0.7071067811865475, 0.7071067811865475),
			Vector.init(1, 0),
			Vector.init(0.7071067811865475, -0.7071067811865475),
			Vector.init(0, -1),
			Vector.init(-0.7071067811865475, -0.7071067811865475),
			Vector.init(-1, 0),
			Vector.init(-0.7071067811865475, 0.7071067811865475)
		];
		for(let i=0; i<poss.length; i++){
			poss[i].x *= geometry.rayon;
			poss[i].y *= geometry.rayon;
			poss[i].x += geometry.pos.x;
			poss[i].y += geometry.pos.y;
			poss[i].x *= scale.x;
			poss[i].y *= scale.y;
			poss[i] = Vector.rotateAVector(poss[i], rotate);
			poss[i].x += posBase.x;
			poss[i].y += posBase.y;
		}
		arrayLines.push(Line.init(poss[0], poss[1]));
		arrayLines.push(Line.init(poss[1], poss[2]));
		arrayLines.push(Line.init(poss[2], poss[3]));
		arrayLines.push(Line.init(poss[3], poss[4]));
		arrayLines.push(Line.init(poss[4], poss[5]));
		arrayLines.push(Line.init(poss[5], poss[6]));
		arrayLines.push(Line.init(poss[6], poss[7]));
		arrayLines.push(Line.init(poss[7], poss[0]));
		if(geometry.fill){
			arrayLines.push(Line.init(poss[0], poss[4]));
			arrayLines.push(Line.init(poss[2], poss[6]));
		}
		geometry.linesFromGeometry = arrayLines;
		return arrayLines;
		
	},

};