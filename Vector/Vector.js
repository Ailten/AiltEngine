
//manage Vector.

const Vector = {

    //make a new vector.
    init: function(x=0, y=0) {
	    return {x: x, y: y};
	},
	
	//make a new vector based to an existent vector (diferent instance).
	initFrom: function(vectorA) {
		return this.init(vectorA.x, vectorA.y);
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
		
	//return true if both vector was equals.
	equals: function(vectorA, vectorB) {
		return (
		    vectorA.x == vectorB.x &&
		    vectorA.y == vectorB.y
		);
	},
	//return true if both axe of a vector is equal to number.
	equalsNum: function(vectorA, n) {
		return (
		    vectorA.x == n &&
		    vectorA.y == n
		);
	},
	
	//add a vector to another.
	add: function(vectorA, vectorB) {
		return Vector.init(
			vectorA.x + vectorB.x,
			vectorA.y + vectorB.y
		);
	},
	//add a number to a vector. 
	addNum: function(vectorA, num) {
		return Vector.init(
			vectorA.x + num,
			vectorA.y + num
		);
	},
	
	//substract a vector to another.
	substract: function(vectorA, vectorB) {
		return Vector.init(
			vectorA.x - vectorB.x,
			vectorA.y - vectorB.y
		);
	},
	//substract a number to a vector.
	substractNum: function(vectorA, num) {
		return Vector.init(
			vectorA.x - num,
			vectorA.y - num
		);
	},
	
	//multiply a vector to another.
	multiply: function(vectorA, vectorB) {
		return Vector.init(
			vectorA.x * vectorB.x,
			vectorA.y * vectorB.y
		);
	},
	//multiply a number to a vector.
	multiplyNum: function(vectorA, num) {
		return Vector.init(
			vectorA.x * num,
			vectorA.y * num
		);
	},
	
	//length of a vector (dist from 0,0 to vector pos).
	lengthOfAVector: function(vectorA) {
		return Math.sqrt( (vectorA.x*vectorA.x) + (vectorA.y*vectorA.y) );
	},
	
	//return the distance between two vector.
	dist: function(vectorA, vectorB) {
		return Vector.lengthOfAVector(Vector.substract(vectorB, vectorA));
	},
	
	//return a new vector normalise.
	normalize: function(vectorA) {
		let diago = Vector.lengthOfAVector(vectorA);
		if(diago == 0)
			return Vector.initFrom(vectorA);
		return Vector.init(
		    vectorA.x / diago,
		    vectorA.y / diago,
		);
	},
	
	//apply a rotation in a vector.
	rotateAVector: function(direction, degreeAngle){
		let eulerAngle = Math.degreeToEuler(degreeAngle);
		return Vector.init(
			Math.cos(eulerAngle) * direction.x + (-Math.sin(eulerAngle)) * direction.y,
			Math.sin(eulerAngle) * direction.x + Math.cos(eulerAngle) * direction.y
		);
	},
	
	//return a new position before rotate around an other position.
	rotateAround: function(posA, posB, degreeAngle) {
		let out = Vector.substract(posB, posA); //translate for center rotate.
		out = Vector.rotateAVector(out, degreeAngle); //rotate.
		return Vector.add(posA, out); //un-translate.
	},
	
	//cast a direction to an angle.
	castVectorToAngle: function(direction){
		let out = Math.atan2(direction.x, direction.y);
		return Math.eulerToDegree(out);
	},
	//cast an angle to a direction.
	castAngleToVector: function(angle){
		return Vector.rotateAVector(Vector.init(0, 1), angle);
	},
	
	//resize a vector for set length (like normalize, but by sending length).
	resizeAVectorForSetLength: function(vector, length){
		let vectorNormalized = Vector.normalize(vector);
		return Vector.multiply(vectorNormalized, length);
	},
	//find end pos of a vector, by sending pos start, vector direction, and length of vector.
	findEndOfVector: function(posStart, direction, length) {
		return Vector.add(posStart, Vector.resizeAVectorForSetLength(direction, length));
	},
	
	//lerp from vectorA to vectorB.
	lerp: function(vectorA, vectorB, i) {
		return Vector.init(
		    Math.lerp(vectorA.x, vectorB.x, i),
		    Math.lerp(vectorA.y, vectorB.y, i)
		);
	},
	//lerp from vectorA to vectorC.
	tripleLerp: function(vectorA, vectorB, vectorC, i) {
		let a_b = Vector.lerp(vectorA, vectorB, i);
		let b_c = Vector.lerp(vectorB, vectorC, i);
		
		return Vector.lerp(a_b, b_c, i);
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
	
}