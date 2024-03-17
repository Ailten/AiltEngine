
//manage an enum system.

const Enum = {

    //create an new enum.
	//need: ...
    init: function(nameNewEnum, ...allStats) {
	
	    this[nameNewEnum] = {};
		
		for(let i=0; i<allStats.length; i++){
		    this[nameNewEnum][allStats[i]] = i;
		}
	
	}
	
	/*/ --- doc --- [beta]
	Enum.init( //create a new enum.
      'MobStat', //name of enum.
      'atack', //all state...
      'sleep'
    );
    
    let a = Enum.MobStat.atack; //get a state of an enum maked.
	//*/

};