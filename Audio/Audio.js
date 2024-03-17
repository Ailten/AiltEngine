
//manage audio.

const Audio = {
	
	audioLongLevel: [], //audio of background levels.
	
	audioLongVolumeMax: 1, //volume max for audio background.
	audioShortVolumeMax: 1, //volume max for audio.
	
	//add an audio.
	init: function(urlAudio, level=null) {
		
		let newAudio = document.createElement('audio'); //create dom audio player.
		
		let source = newAudio.appendChild(document.createElement('source')); //create source with url file.
		source.setAttribute('src', urlAudio);
		source.setAttribute('type', 'audio/mpeg'); //mp3 format.
		
		if(level){ //if a name level send, save the audio.
		    newAudio.loop = true;
			this.audioLongLevel[level] = newAudio; //index is name of level.
		}
		
		return newAudio;
		
	},
	
	//play a long audio.
	longPlay: function(level) {
		if(this.audioLongLevel[level])
		    this.audioLongLevel[level].play();
	},
	
	//stop a long audio.
	longStop: function(level) {
		if(this.audioLongLevel[level]){
			this.audioLongLevel[level].pause();
			this.audioLongLevel[level].currentTime = 0;
		}
	},
	
	//edit volume of a long audio.
	longVolume: function(level, volume) {
		if(this.audioLongLevel[level])
		    this.audioLongLevel[level].volume = volume *this.audioLongVolumeMax;
	},
	
	
	//play an audio.
	shortPlay: function(currentAudio) {
		currentAudio.play();
	},
	
	//edit volume of an audio
	shortVolume: function(currentAudio, volume) {
		currentAudio.volume = volume *this.audioShortVolumeMax;
	},
	
};