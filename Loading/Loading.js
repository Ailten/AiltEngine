
//manage all image loading.

const Loading = {

    comptImageLoad: 0, //the number of image in load.
	comptImageLoaded: 0, //the number of image end load.
	
	isInLoad: false,
	
	maxReload: 10, //number max of reload the same image.
	
	//load an image an make the wait.
    loadAnImage: function(urlImg) {
		
		let img = new Image();
		
		this.comptImageLoad++;
		
		img.onload = function(){ //when an image end load.
			
			Loading.comptImageLoaded++;
			
			if(Loading.comptImageLoaded == Loading.comptImageLoad){ //end loading.
			    Loading.comptImageLoaded = 0;
				Loading.comptImageLoad = 0;
			    Loading.isInLoad = false;
			}
			
		};
		
		img.onerror = function() { //when an image error to load.
			
			//*/ --- cut loading with error message.
			if(this['reload'] == Loading.maxReload){
				alert('an error is appear when loading image :(');
			    console.log('an image dont want to be load !');
			    return;
			}
			//*/
			
			//*/ --- redo load image.
			this['reload'] = (this['reload']==undefined? 1: this['reload']+1);
			console.log('reload img : '+this['reload']);
			let url = this.src;
			this.src = '';
			this.src = url;
			//*/
			
		}
		
		this.isInLoad = true;
		
		img.src = urlImg;
		
		return img;
		
	},
	
	
	
	//draw the loading screen.
	draw: function() {
		
		Canvas.drawRect( //background.
		    Vector.init(0, 0), 
			Canvas.size, 
			'#000', 
			true
		);
		
		let sizeBackgroundBar = Vector.init(
		    Math.floor(Canvas.size.x * 0.75),
			Math.floor(Canvas.size.y * 0.05)
		);
		let posBackgroundBar = Vector.init(
		    (Canvas.size.x - sizeBackgroundBar.x) /2,
		    (Canvas.size.y - sizeBackgroundBar.y) /2,
		);
		
		Canvas.drawRect( //background bar.
		    posBackgroundBar, 
			sizeBackgroundBar, 
			'#FFF', 
			false
		);
		
		let sizeBar = Vector.init(
		    Math.floor((Loading.comptImageLoaded / Loading.comptImageLoad) *sizeBackgroundBar.x),
			sizeBackgroundBar.y
		);
		
		Canvas.drawRect( //bar.
		    posBackgroundBar, 
			sizeBar, 
			'#FFF', 
			true
		);
		
	},

};