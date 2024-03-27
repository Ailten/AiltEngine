
//manage input keyboard.

const Input = {

    inputs: [], //array of all inputs existing.
    	
    //create a new input.
    init: function(key) {
    	
    	this.inputs.push({
    		key: key, //key to press for active input.
    		down: false, //save if the input is down or up.
    		timeOfLastChange: 0, //save the time when he was down or up in last.
    		
    		keyReMap: key, //the key customise by the user.
    	});
    	
    },
	
	//change state of an input (handle event key).
	inputChangeState: function(evnt){ //key, down
	
	    if(evnt.repeat)
			return;
		
		let inputFind = this.inputs.find((currentInput) => currentInput.keyReMap == evnt.key);
		
		if(inputFind === undefined)
			return;
		
		inputFind.down = (evnt.type == 'keydown');
		
		inputFind.timeOfLastChange = Update.time;
		
	},
	
	//get an input in inputs array.
	getInput: function(key) {
		return this.inputs.find((currentInput) => currentInput.key == key);
	},
	
	//check if a key is press.
	isDown: function(key) {
		return this.getInput(key).down;
	},
	
	//return if a key is press now.
	isDownNow(key) {
		let inputFind = this.getInput(key);
		return (
		    inputFind.timeOfLastChange == Update.time &&
			inputFind.down
		);
	},
	
	//return if a key is un-press now.
	isUpNow(key) {
		let inputFind = this.getInput(key);
		return (
		    inputFind.timeOfLastChange == Update.time &&
			!inputFind.down
		);
	},
	
	//remap input in preference user
	remapInput: function(inputRemap){
		
		/*/ --- example param (or string vertion).
		Input.remapInput([
			{key: 'ArrowUp', keyReMap: 'w'},
			{key: 'ArrowLeft', keyReMap: 'a'},
			{key: 'ArrowDown', keyReMap: 's'},
			{key: 'ArrowRight', keyReMap: 'd'}
		]);
		//*/
		
		if(!inputRemap || inputRemap.length==0)
			return;
		
		if(typeof inputRemap === 'string')
		    inputRemap = JSON.parse(inputRemap);
		
		inputRemap.forEach((ir) => {
			Input.inputs.find((i) => i.key == ir.key).keyReMap = ir.keyReMap;
		});
		
	}
	

};


//event when key is down.
window.addEventListener('keydown', function(evnt) {
	Input.inputChangeState(evnt);
});


//event when key is up.
window.addEventListener('keyup', function(evnt) {
	Input.inputChangeState(evnt);
});