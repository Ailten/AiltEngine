
//manage Update.

const Update = {

	miliSecBetwinTwoUpdate: null, //mili seconde betwin two update execution.
	
	time: 0, //milisec from the game was launch.
	
	//set up the update event.
	//need: Time, Canvas, Camera.
    initUpdate: function(fps=60) {
		
		this.miliSecBetwinTwoUpdate = Math.floor(1000 / fps);
		
		setInterval(function(){
			
			Canvas.clean(); //clean last frame draw.
			
			if(Loading.isInLoad){ //when loading screen, just draw loading screen and skip.
				Loading.draw();
			    return;
			}
			
			if(!Level.transitionIsActive)
				Level.updateAllLevels(); //do update of all levels.
			
			Level.updateLevel(); //do update of level manager (transition level).
			
			Camera.followEntity(); //move camera.
			
			Entity.entitiesFollowCam(); //replace all entity marked follow cam.
			
			Canvas.draw(); //draw new frame.
			
			Update.time += Update.miliSecBetwinTwoUpdate; //increase time.
			
		}, this.miliSecBetwinTwoUpdate);
		
	},

};