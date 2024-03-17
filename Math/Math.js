
//add function to Math.

//lerp from value a to value b.
Math.lerp = function(a, b, i) {
	return a*(1-i)+b*i;
};

//return the diference between two value (all time positiv).
Math.dif = function(a, b) {
	return Math.abs(a-b);
};

//return the value in a range set.
Math.clamp = function(min, a, max) {
	return Math.max(min, Math.min(a, max));
};

//cast time in miliseconde to array of char for hours, minutes, seconde, miliseconde.
Math.milisecToTimeString = function(milisec) {
	
	const milisecInHour = 1000*60*60;
	const milisecInMin = 1000*60;
	
	let out = {
		hours: 0,
		min: 0,
		sec: 0,
		mili: 0
	};
	
	out.hours = Math.floor(milisec /milisecInHour); //hours.
	out.min = Math.floor((milisec - out.hours*milisecInHour) /milisecInMin); //min.
	out.sec = Math.floor((milisec - out.hours*milisecInHour - out.min*milisecInMin) /1000); //sec.
	out.mili = milisec%1000;
	
	if(out.hours < 100) out.hours = '00'+out.hours;
	else if(out.hours < 10) out.hours = '0'+out.hours;
	else out.hours += '';
	if(out.min < 10) out.min = '0'+out.min;
	else out.min += '';
	if(out.sec < 10) out.sec = '0'+out.sec;
	else out.sec += '';
	if(out.mili < 10) out.mili = '0'+out.mili;
	else out.mili += '';
	
	return out;
	
};

//cast a euler angle to degree angle.
Math.degreeToEuler = function(euler) {
	return (euler * Math.PI/180);
};
//cast a degree angle to euler angle.
Math.eulerToDegree = function(degree) {
	return (degree / Math.PI*180);
};

//take two position, and return an angle of rotation to apply at first position, for make it look at the seconde position.
Math.lookAt = function(posA, posB) {
	return Math.degreeToEuler(Math.atan2(posB.x-posA.x, posB.y-posA.y));
};

//return a random number integer (both include).
Math.rng = function(min=0, max=99) {
	return Math.floor((Math.random() * ((max-min)+1))) +min;
};

