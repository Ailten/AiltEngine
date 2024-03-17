
//manage Vector.

const Vector = {

    //make a new vector.
    init: function(x=0, y=0) {
	    return {x: x, y: y};
	},
	
	//add many vector.
	add: function(...vectors) {
		let sum = Vector.init(0, 0);
		vectors.forEach((v) => {
		    sum.x += v.x;
		    sum.y += v.y;
		});
		return sum;
	},
	
	//lerp from vectorA to vectorB.
	lerp: function(vectorA, vectorB, i) {
		return Vector.init(
		    Math.lerp(vectorA.x, vectorB.x, i),
		    Math.lerp(vectorA.y, vectorB.y, i)
		);
	},
	
	//lerp quadratic from vectorA to vectorD.
	quadraticLerp: function(vectorA, vectorB, vectorC, vectorD, i) {
		let a_b = Vector.lerp(vectorA, vectorB, i);
		let b_c = Vector.lerp(vectorB, vectorC, i);
		let c_d = Vector.lerp(vectorC, vectorD, i);
		
		let ab_bc = Vector.lerp(a_b, b_c, i);
		let bc_cd = Vector.lerp(b_c, c_d, i);
		
		return Vector.lerp(ab_bc, bc_cd, i);
	},
	
	//lerp quadratic from vectorA to vectorD, (find two other point base on square idee).
	quadraticLerp: function(vectorA, vectorD, i, invers=false) {
		let vectorB = Vector.init(vectorA.x, vectorD.y);
		let vectorC = Vector.init(vectorD.x, vectorA.y);
		
		if(invers)
			return Vector.quadraticLerp(vectorA, vectorC, vectorB, vectorD, i);
		return Vector.quadraticLerp(vectorA, vectorB, vectorC, vectorD, i);
	},
	
	//make a new vector based to an existent vector (diferent instance).
	initFrom: function(vectorA) {
		return this.init(vectorA.x, vectorA.y);
	},
	
	//return the distance between two vector.
	dist: function(vectorA, vectorB) {
		let x = Math.dif(vectorA.x, vectorB.x);
		let y = Math.dif(vectorA.y, vectorB.y);
		return Math.sqrt(x*x + y*y);
	},
		
	//return true if both vector was equals.
	equals: function(vectorA, vectorB) {
		return (
		    vectorA.x == vectorB.x &&
		    vectorA.y == vectorB.y
		);
	},
	
	//round value of vector.
	round: function(vectorA) {
		return Vector.init(
		    Math.round(vectorA.x),
		    Math.round(vectorA.y)
		);
	},
	//round value (lower) of vector.
	floor: function(vectorA) {
		return Vector.init(
		    Math.floor(vectorA.x),
		    Math.floor(vectorA.y)
		);
	},
	//round value (upper) of vector.
	ceil: function(vectorA) {
		return Vector.init(
		    Math.ceil(vectorA.x),
		    Math.ceil(vectorA.y)
		);
	},
	
	//return a new vector normalise.
	normalize: function(vectorA) {
		let diago = Math.sqrt((vectorA.x*vectorA.x)+(vectorA.y*vectorA.y));
		if(diago == 0)
			return Vector.initFrom(vectorA);
		return Vector.init(
		    vectorA.x / diago,
		    vectorA.y / diago,
		);
	},	
	
	//return a new vector, both value multiply by n.
	multiply: function(vectorA, n) {
		return Vector.init(
		    vectorA.x * n,
		    vectorA.y * n
		);
	},
	
	//apply a rotation in a vector.
	rotateAVector: function(direction, degreeAngle){
		let eulerAngle = Math.degreeToEuler(-degreeAngle);
		return Vector.init(
			Math.cos(eulerAngle) * direction.x + (-Math.sin(eulerAngle)) * direction.y,
			Math.sin(eulerAngle) * direction.x + Math.cos(eulerAngle) * direction.y
		);
	},
	
	//return a new position before rotate around an other position.
	rotateAround: function(posA, posB, degreeAngle) {
		let out = Vector.init( //translate for center rotate.
		    posA.x - posB.x,
		    posA.y - posB.y,
		);
		out = Vector.rotateAVector(out, degreeAngle); //rotate.
		out = Vector.init( //un-translate.
		    out.x + posB.x,
		    out.y + posB.y,
		);
		return out;
	},
	
	//find end pos of a vector, by sending pos start, vector direction, and length of vector.
	findEndOfVector: function(posStart, direction, length) {
		let directionLength = Math.sqrt( //get length direction.
			Math.pow(direction.x, 2) + 
			Math.pow(direction.y, 2)
		);
		let multiplyDirection = length / directionLength;
		return Vector.init(
			posStart.x + direction.x * multiplyDirection,
			posStart.y + direction.y * multiplyDirection
		);
	},
	
	//using for bounce of line in colide.
	getAngleOfAVector: function(direction){
		let out = Math.atan2(direction.x, direction.y);
		out /= Math.PI;
		out = (out + 1) /2;
		return out * 360;
	},
	
}