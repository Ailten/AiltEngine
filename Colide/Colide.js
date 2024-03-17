
//manage colide and trigger.

const Colide = { //[ADD:V1.1]

    //return an entity find, if the entity send at the position send, colide to an other entity (solide with solide).
    tryColide: function(e, newPos) {
		
		let out = null;
		let ePos = e.pos;
		e.pos = newPos;
		
		Entity.entities.filter((ce) => 
		        ce.isActive && //entity is active.
		        ce['geometrySolid'] //only entity with colid.
			).forEach((ce) => {
				
		        if(!out && e.id != ce.id){ //skip forEach if colide find OR if same entity.
					
					out = Colide.colideTwoEntity(e, ce, 'geometrySolid', 'geometrySolid');
					
				}
		
		});
		
		e.pos = ePos;
		return out;
		
	},
	
	//try to move an entity to a position, but block if colide [ADD:V1.1].
	tryMoveTo: function(e, newPos, precision=5) {
		
		let lastPosNoColide = e.pos;
		for(i=1; i<=precision; i++){
			let newPosLerp = Vector.lerp(e.pos, newPos, i / precision);
			if(this.tryColide(e, newPosLerp))
				break;
			lastPosNoColide = newPosLerp;
		}
		e.pos.x = lastPosNoColide.x;
		e.pos.y = lastPosNoColide.y;
		
	},
	
	//return true if two rectangle colide together.
	colideRectToRect: function(rectATopLeft, rectADownRight, rectBTopLeft, rectBDownRight) {
		
		return (
		    rectBTopLeft.x < rectADownRight.x && //if B is in cone DownRight.
			rectBTopLeft.y > rectADownRight.y && 
			rectBDownRight.x > rectATopLeft.x && //if B is in cone TopLeft.
			rectBDownRight.y < rectATopLeft.y
		);
		
	},
	
	//return true if two circle colide together.
	colideCircleToCircle: function(posCircleA, rayonCircleA, posCircleB, rayonCircleB) {
		
		return (Vector.dist(posCircleA, posCircleB) < (rayonCircleA + rayonCircleB));
		
	},
	
	//return true if a circle and a rect colide together.
	colideCircleToRect: function(posCircleA, rayonCircleA, rectBTopLeft, rectBDownRight) {
		
		return (
		    (
			    posCircleA.x > rectBTopLeft.x && //center of circle into rect (+up and down area).
			    posCircleA.y > (rectBDownRight.y - rayonCircleA) &&
			    posCircleA.x < rectBDownRight.x &&
			    posCircleA.y < (rectBTopLeft.y + rayonCircleA)
			) || (
			    posCircleA.x > (rectBTopLeft.x - rayonCircleA) && //center of circle into rect (+left and right area).
			    posCircleA.y > rectBDownRight.y &&
			    posCircleA.x < (rectBDownRight.x + rayonCircleA) &&
			    posCircleA.y < rectBTopLeft.y
			) || (
			    Vector.dist(posCircleA, rectBTopLeft) < rayonCircleA || //in a circle of one corner angle.
			    Vector.dist(posCircleA, rectBDownRight) < rayonCircleA ||
			    Vector.dist(posCircleA, Vector.init(rectBTopLeft.x, rectBDownRight.y)) < rayonCircleA ||
			    Vector.dist(posCircleA, Vector.init(rectBDownRight.x, rectBTopLeft.y)) < rayonCircleA
			)
		);
		
	},
	
    //return an entity trigger find with an entity solid.
	tryTrigger: function(e) {
		
		let out = null;
		
		for(let j=Entity.entities.length-1; j>=0; j--){
			if(out===null &&
				Entity.entities[j].isActive && 
				Entity.entities[j]['geometryTrigger'] && 
				e.id != Entity.entities[j].id
			){
				let ce = Entity.entities[j];
				
				if(ce['isHud']){ //if is hud, remap trigger at screen.
				
					let fakeCe = {
						pos: Vector.init(
							(ce.pos.x - Camera.pos.x) *(1/Camera.zoom) + Camera.pos.x, 
							(ce.pos.y - Camera.pos.y) *(1/Camera.zoom) + Camera.pos.y
						),
						geometryTrigger: [],
					};
					for(let i=0; i<ce.geometryTrigger.length; i++){
						if(ce.geometryTrigger[i].type == 'Rectangle'){
							fakeCe.geometryTrigger.push(Rectangle.init(
								Vector.multiply(ce.geometryTrigger[i].posUpLeft, (1/Camera.zoom)), 
								Vector.multiply(ce.geometryTrigger[i].posDownRight, (1/Camera.zoom))
							));
						}else if(ce.geometryTrigger[i].type == 'Circle'){
							fakeCe.geometryTrigger.push(Circle.init(
								Vector.multiply(ce.geometryTrigger[i].pos, (1/Camera.zoom)), 
								(ce.geometryTrigger[i].rayon)*(1/Camera.zoom)
							));
						}
					}
					out = Colide.colideTwoEntity(e, fakeCe, 'geometrySolid', 'geometryTrigger');
					if(out != null)
						out = ce;
				
				}else{
				
					out = Colide.colideTwoEntity(e, ce, 'geometrySolid', 'geometryTrigger');
					
				}
				
			}
		}
		
		return out;
		
	},
	
	//send an entity solide, and execute every eventTrigger of every entity he colide.
    executeTrigger: function(e){
		
		Entity.entities.filter((ce) => 
		        ce['geometryTrigger'] && //only entity with colid.
		        ce.isActive //entity is active.
			).forEach((ce) => {
				
		        if(e.id != ce.id){ //skip forEach if colide find OR if same entity.
					
					let triggerFind = Colide.colideTwoEntity(e, ce, 'geometrySolid', 'geometryTrigger');
					
					if(triggerFind && triggerFind.eventTrigger)
						triggerFind.eventTrigger(triggerFind, e);
					
				}
		
		});
		
	},
	
	//calcul if two entity colide eatch other.
	colideTwoEntity: function(e, ce, geometryE='geometrySolid', geometryCe='geometrySolid') {
		
		let cePosA, cePosB, ePosA, ePosB; //pos cast in world for geometry.
		
		for(let ei=0; ei<e[geometryE].length; ei++) //process for all colid geometry in e (cut if find).
		for(let cei=0; cei<ce[geometryCe].length; cei++){ //process for all colid geometry in ce (cut if find).
		
			if(ce[geometryCe][cei].type == 'Rectangle'){
			    cePosA = Vector.add(ce.pos, ce[geometryCe][cei].posUpLeft);
			    cePosB = Vector.add(ce.pos, ce[geometryCe][cei].posDownRight);
			}else{
			    cePosA = Vector.add(ce.pos, ce[geometryCe][cei].pos);
			}
			if(e[geometryE][ei].type == 'Rectangle'){
		        ePosA = Vector.add(e.pos, e[geometryE][ei].posUpLeft);
		        ePosB = Vector.add(e.pos, e[geometryE][ei].posDownRight);
			}else{
		        ePosA = Vector.add(e.pos, e[geometryE][ei].pos);
			}
		
		    if(ce[geometryCe][cei].type == 'Rectangle' && e[geometryE][ei].type == 'Rectangle' && Colide.colideRectToRect( //check colide two entity.
		        cePosA, //current solid corner top left.
		        cePosB, //current solid corner down right.
		        ePosA, //entity top left.
		    	ePosB //entity down right.
		    ))
		    	return ce;
			
			if(ce[geometryCe][cei].type == 'Circle' && e[geometryE][ei].type == 'Circle' && Colide.colideCircleToCircle( //check colide two entity.
		        cePosA, //current solid corner top left.
		        ce[geometryCe][cei].rayon, //rayon.
		        ePosA, //entity top left.
		    	e[geometryE][ei].rayon //rayon.
		    ))
		    	return ce;
				
			if(ce[geometryCe][cei].type == 'Circle' && e[geometryE][ei].type == 'Rectangle' && Colide.colideCircleToRect( //check colide two entity.
		        cePosA, //entity top left.
		    	ce[geometryCe][cei].rayon, //rayon.
		        ePosA, //current solid corner top left.
		        ePosB //current solid corner down right.
		    ))
		    	return ce;
			
			if(ce[geometryCe][cei].type == 'Rectangle' && e[geometryE][ei].type == 'Circle' && Colide.colideCircleToRect( //check colide two entity.
		        ePosA, //entity top left.
		    	e[geometryE][ei].rayon, //rayon.
		        cePosA, //current solid corner top left.
		        cePosB //current solid corner down right.
		    ))
		    	return ce;
			
		}
		return null;
		
	},
	
	
	// ---> lines colide.
	
	//send two lines geometry, and return the position when they crossing (or null).
	findCrossLines: function(lineOne, lineTwo) {
		
		let lineTwoEndBis = Vector.init(
			lineTwo.posStart.x - 2*(lineTwo.posEnd.x - lineTwo.posStart.x),
			lineTwo.posStart.y - 2*(lineTwo.posEnd.y - lineTwo.posStart.y)
		);
		
		let den = ( //if line paralèle.
			(lineOne.posStart.x - lineOne.posEnd.x) *
			(lineTwo.posStart.y - lineTwoEndBis.y) - 
			(lineOne.posStart.y - lineOne.posEnd.y) * 
			(lineTwo.posStart.x - lineTwoEndBis.x)
		);
		if(den == 0)
		return null;
		
		let t = (
			(lineOne.posStart.x - lineTwo.posStart.x) * 
			(lineTwo.posStart.y - lineTwoEndBis.y) - 
			(lineOne.posStart.y - lineTwo.posStart.y) * 
			(lineTwo.posStart.x - lineTwoEndBis.x)
		) /den;
		let u = -(
			(lineOne.posEnd.x - lineOne.posStart.x) * 
			(lineOne.posStart.y - lineTwo.posStart.y) - 
			(lineOne.posEnd.y - lineOne.posStart.y) * 
			(lineOne.posStart.x - lineTwo.posStart.x)
		) /den;
		
		//dont colide.
		if(t<0 || t>1 || u<0 || u>1)
		return null;
		
		//vérifie le dépacement des limite du miroire.
		let limite = Vector.init(
			lineTwo.posStart.x + u*(lineTwoEndBis.x - lineTwo.posStart.x),
			lineTwo.posStart.y + u*(lineTwoEndBis.y - lineTwo.posStart.y)
		);
		if(Vector.dist(lineTwo.posStart, lineTwo.posEnd) < Vector.dist(lineTwo.posStart, limite))
		return null;
		
		let out = Vector.init(
			Math.round(lineOne.posStart.x + t*(lineOne.posEnd.x - lineOne.posStart.x)),
			Math.round(lineOne.posStart.y + t*(lineOne.posEnd.y - lineOne.posStart.y))
		);
		
		if(Vector.dist(lineOne.posStart, out) < 3) //ignore if collid to close from start.
			return null;
		
		return out; //find an intersection.
		
	},
	
	//send both lines, and return a new line of rest first line after rebond on the second.
	lineBounce: function(lineOne, lineTwo) {
		
		let crossingPos = Colide.findCrossLines(lineOne, lineTwo);
		
		if(crossingPos == null) //not crossing, no bounce.
			return null;
		
		let lengthToColide = Vector.dist( //length of lineOne to crossing pos.
			lineOne.posStart, 
			crossingPos
		);
		let lengthOfBounce = Vector.dist( //length of line bounce.
			lineOne.posStart,
			lineOne.posEnd
		) - lengthToColide;
		
		let lineOneDirection = Vector.normalize(Vector.init( //direction of line one normalise.
			lineOne.posEnd.x - lineOne.posStart.x,
			lineOne.posEnd.y - lineOne.posStart.y,
		));
		let lineTwoDirection = Vector.normalize(Vector.init( //direction of lien two normalise.
			lineTwo.posEnd.x - lineTwo.posStart.x,
			lineTwo.posEnd.y - lineTwo.posStart.y,
		));
		
		let lineOneAngle = Vector.getAngleOfAVector(lineOneDirection); //angle of line one.
		let lineTwoAngle = Vector.getAngleOfAVector(lineTwoDirection); //angle of line two.
		let bounceAngle = (lineOneAngle - lineTwoAngle) *2; //angle bounce.
		let bounceDirection = Vector.rotateAVector(lineOneDirection, bounceAngle); //direction of bounce.
		
		return Line.init( //make the line bounce.
			crossingPos,
			Vector.findEndOfVector(crossingPos, bounceDirection, lengthOfBounce)
		);
		
	},

};