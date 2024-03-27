
//manage colide and trigger.

const Colide = {

    //return an entity find, if the entity send, colide to an other entity.
    findEntityColide: function(e, geometryTypeE='geometrySolid', geometryTypeCe='geometrySolid', tag=null) {
		
		let out = null;
		Entity.entities.filter((ce) => 
		        ce.isActive && //entity is active.
		        ( //only entity with colid.
					(ce['geometrySolid'] && geometryTypeCe=='geometrySolid') ||
					(ce['geometryTrigger'] && geometryTypeCe=='geometryTrigger')
				) && ( //tag filter.
					ce[tag] || tag==null
				)
			).forEach((ce) => {
				
		        if(!out && e.id != ce.id){ //skip forEach if colide find OR if same entity.
					if(Colide.isTwoEntityColide(e, ce, geometryTypeE, geometryTypeCe))
						out = ce;
				}
		
		});
		return out;
		
	},
	
	//try to move an entity send (if one colide find, rollback the move apply).
	tryMove: function(e, moveToApply, tag=null){
		
		e.pos = Vector.add(e.pos, moveToApply);
		if(Colide.findEntityColide(e, 'geometrySolid', 'geometrySolid', tag) != null)
			e.pos = Vector.substract(e.pos, moveToApply);
		
	},
	
    //execute enventTrigger of entity triggered.
    executeEventTriggerFind: function(e, tag=null) {
		
		Entity.entities.filter((ce) => 
		        ce.isActive && //entity is active.
		        ce['geometryTrigger'] && ( //has trigger and tag filter.
					ce[tag] || tag==null
				)
			).forEach((ce) => {
				
		        if(e.id != ce.id){ //skip forEach if colide find OR if same entity.
					if(Colide.isTwoEntityColide(e, ce, 'geometrySolid', 'geometryTrigger') != null)
						ce.eventTrigger(ce, e);
				}
		
		});
		
	},
	
	//return true if both entity colide.
	isTwoEntityColide: function(e, ce, geometryTypeE, geometryTypeCe) {
		
		let success=false;
		e[geometryTypeE].forEach(geoE => {
			if(!success){
			ce[geometryTypeCe].forEach(geoCe => {
				if(!success){
					
					let arrayLineGeoE = Geometry.getArrayLinesFromGeometry(geoE, e.pos, e.rotate, e.scale);
					let arrayLineGeoCe = Geometry.getArrayLinesFromGeometry(geoCe, ce.pos, ce.rotate, ce.scale);
					
					arrayLineGeoE.forEach(lineE => {
						if(!success){
						arrayLineGeoCe.forEach(lineCe => {
							if(!success){
								
								success = Colide.isTwoLinesColide(lineE, lineCe);
								
							}
						});
						}
					});
					
				}
			});
			}
		});
		return success;
		
	},
	
	//return true if both line send ar crossing.
	isTwoLinesColide: function(lineA, lineB){
		
		return (Colide.findCrossPosBetweenTwoLines(lineA, lineB) != null);
		
	},
	
	//send two lines geometry, and return the position when they crossing (or null).
	findCrossPosBetweenTwoLines: function(lineA, lineB){
		
		let lineBEndBis = Vector.init(
			lineB.posStart.x - 2*(lineB.posEnd.x - lineB.posStart.x),
			lineB.posStart.y - 2*(lineB.posEnd.y - lineB.posStart.y)
		);
		
		let den = ( //if line paralèle.
			(lineA.posStart.x - lineA.posEnd.x) *
			(lineB.posStart.y - lineBEndBis.y) - 
			(lineA.posStart.y - lineA.posEnd.y) * 
			(lineB.posStart.x - lineBEndBis.x)
		);
		if(den == 0)
		return null;
		
		let t = (
			(lineA.posStart.x - lineB.posStart.x) * 
			(lineB.posStart.y - lineBEndBis.y) - 
			(lineA.posStart.y - lineB.posStart.y) * 
			(lineB.posStart.x - lineBEndBis.x)
		) /den;
		let u = -(
			(lineA.posEnd.x - lineA.posStart.x) * 
			(lineA.posStart.y - lineB.posStart.y) - 
			(lineA.posEnd.y - lineA.posStart.y) * 
			(lineA.posStart.x - lineB.posStart.x)
		) /den;
		
		//dont colide.
		if(t<0 || t>1 || u<0 || u>1)
			return null;
		
		//vérifie le dépacement des limite du miroire.
		let limite = Vector.init(
			lineB.posStart.x + u*(lineBEndBis.x - lineB.posStart.x),
			lineB.posStart.y + u*(lineBEndBis.y - lineB.posStart.y)
		);
		if(Vector.dist(lineB.posStart, lineB.posEnd) < Vector.dist(lineB.posStart, limite))
			return null;
		
		let out = Vector.init(
			Math.round(lineA.posStart.x + t*(lineA.posEnd.x - lineA.posStart.x)),
			Math.round(lineA.posStart.y + t*(lineA.posEnd.y - lineA.posStart.y))
		);
		
		if(Vector.dist(lineA.posStart, out) < 3) //ignore if collid to close from start.
			return null;
		
		return out; //find an intersection.
		
	},
	
	//send both lines, and return a new line of rest first line after rebond on the second.
	getBounceLine: function(lineA, lineB, staySameLength=true) {
		
		let crossingPos = Colide.findCrossLines(lineA, lineB);
		
		if(crossingPos == null) //not crossing, no bounce.
			return null;
		
		let lengthLineOne = Vector.dist( //length of line one.
			lineA.posStart,
			lineA.posEnd
		);
		let lengthOfBounce = lengthLineOne - (staySameLength? Vector.dist(lineA.posStart, crossingPos): 0); //length of line bounce.
		
		let lineOneDirection = Vector.normalize(Vector.init( //direction of line one normalise.
			lineA.posEnd.x - lineA.posStart.x,
			lineA.posEnd.y - lineA.posStart.y,
		));
		let lineTwoDirection = Vector.normalize(Vector.init( //direction of lien two normalise.
			lineB.posEnd.x - lineB.posStart.x,
			lineB.posEnd.y - lineB.posStart.y,
		));
		
		let dotProduct = lineOneDirection.x * lineTwoDirection.x + lineOneDirection.y * lineTwoDirection.y;
		let bounceDirection = Vector.init(
			(lineOneDirection.x - 2 * dotProduct * lineTwoDirection.x) *-1,
			(lineOneDirection.y - 2 * dotProduct * lineTwoDirection.y) *-1
		);
		
		return Line.init( //make the line bounce.
			crossingPos,
			Vector.findEndOfVector(crossingPos, bounceDirection, lengthOfBounce)
		);
		
	},
	
	//todo: path finding espace free.

};