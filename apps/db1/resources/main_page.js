// ==========================================================================
// Project:   Db1 - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Db1 */

var obsColumn = [
	SC.TableColumn.create({ key:   'file_name', label: 'Name', width:210}),
	SC.TableColumn.create({ key:   'MinRes', label: 'Resolution', width:70}),
	SC.TableColumn.create({ key:   'instrument', label: 'Inst', width: 50 }),
	SC.TableColumn.create({ key:   'MissionPhase', label: 'Msn Phase', width:70}),
	SC.TableColumn.create({ key:   'Thumb', label: 'SeqID', width:50}),
	SC.TableColumn.create({ key:   'Exposure', label: 'Exposure', width:60}),
	SC.TableColumn.create({ key:   'phase', label: 'phase', width:60}),
	SC.TableColumn.create({ key:   'Filter', label: 'Filter', width:40}),
	SC.TableColumn.create({ key:   'i', label: 'img i', width:65}),
	SC.TableColumn.create({ key:   'e', label: 'img e', width:65}),
	SC.TableColumn.create({ key:   'iSpice', label: 'inst Spice', width:90}),
	SC.TableColumn.create({ key:   'tSpice', label: 'tSpice', width:40}),
   SC.TableColumn.create({ key:   'shape', label: 'shape', width:40}),
  	SC.TableColumn.create({ key:   'projection', label: 'Projection', width:90}),
   SC.TableColumn.create({ key:   'Pole', label: 'Pole', width:40}),
	SC.TableColumn.create({ key:   'ObsType', label: 'ObsType', width:130}),
	SC.TableColumn.create({ key:   'SequenceTitle', label: 'SequenceTitle', width:200}),

/*
	SC.TableColumn.create({ key:   'lat', label: 'Img Lat', width:60}),
	SC.TableColumn.create({ key:   'lon', label: 'Img Lon', width:60}),
   //SC.TableColumn.create({ key:   'Arguments', label: 'Arg', width:40}),
   //SC.TableColumn.create({ key:   'Phase', label: 'Phase', width:80}),
	//SC.TableColumn.create({ key:   'Quality', label: 'Qual', width:40}),
   //SC.TableColumn.create({ key:   'Limb', label: 'Limb', width:40}),
	SC.TableColumn.create({ key:   'Level', label: 'Level', width:40}),
	SC.TableColumn.create({ key:   'search_i', label: 'Search i', width:80}),
	SC.TableColumn.create({ key:   'search_e', label: 'Search e', width:80}),
	//SC.TableColumn.create({ key:   'Processed', label: 'Processed', width:40}),
	//SC.TableColumn.create({ key:   'CalFlat', label: 'CalFlat', width:50}),
	SC.TableColumn.create({ key:   'f_lines', label: 'f_lines', width:70}),
	SC.TableColumn.create({ key:   'f_samples', label: 'f_samples', width:70}),
*/
];



//---------------------------
//---------------------------
//---------------------------
//---------------------------
DrawingClass = SC.View.extend ({
didCreateLayer: function() {
	this.drawStuff();
},//didcreatelayer

//---------------------------
render:  function (context, firstTime) {
      if (firstTime) {
         var frame = this.get('frame');
         context.push ('<canvas width="2448" height="2448"></canvas>');
      }//if
},//render

//---------------------------
mouseDown: function(event) {

	var x = event.originalEvent.offsetX ;
	var y = event.originalEvent.offsetY ;
	//var x = event.originalEvent.layerX ;
	//var y = event.originalEvent.layerY ;
//console.log (event.originalEvent);
//e = event;
	Db1.mapC.clickX = x;
	Db1.mapC.clickY = y;

	Db1.mapC.moveX = 0;
	Db1.mapC.moveY = 0;

	this.toLat (x, y);
   Db1.obsCont.set ('latitude', gLat.toFixed(2));
	num = gLon;
   Db1.obsCont.set ('longtitude', num.toFixed(2));

	
   this.drawStuff();

   return YES;
},//mousedown


//---------------------------
mouseDragged: function(evt) {
	newX = evt.originalEvent.offsetX;
	newY = evt.originalEvent.offsetY;
	//newX = evt.originalEvent.layerX;
	//newY = evt.originalEvent.layerY;
	dx = newX - Db1.mapC.clickX;
	dy = newY - Db1.mapC.clickY;
	if ((dx*dx) + (dy*dy) < 10) return YES;	// skip if small

	Db1.mapC.moveX = newX;
	Db1.mapC.moveY = newY;
   this.drawStuff();

    return YES ; // event was handled!
},//mousedragged

//---------------------------
mouseUp: function(evt) {
    // apply one more time to set final position
	var x = evt.originalEvent.offsetX;
	var y = evt.originalEvent.offsetY;
	//x = evt.originalEvent.layerX;
	//y = evt.originalEvent.layerY;
	this.toLat (x, y);
   Db1.mapC.set ('moveLat', gLat.toFixed(2));
	num = gLon;
   Db1.mapC.set ('moveLon', num.toFixed(2));

   this.mouseDragged(evt); 
   this._mouseDownInfo = null; // cleanup info
   return YES; // handled!

},//mouseup

//---------------------------
// g_coord
//		0 or 180 on the left
//		+E or +W, or both
//		Vesta is +E
//		IAU-Vesta :: 0, +E shift +150.7
toLat: function (x, y) {
	if (! Db1.mapC) return;
	lonStart = parseFloat (Db1.mapC.get('mapStart'));

	if (Db1.mapC.g_target == "Iapetus") {		/// FIXME - use West
      gLat = (1024-y)/1024 * 180 - 90;
      gLon = x/2048 * 360;
      gLon += 180;            // need to deal with map starting at 180 lon
      if (gLon > 360) gLon -= 360;
		return;
	}//iftarget

	// Do the polar coords
	if (Db1.mapC.pole) {
		dx = y - 512;
		dy = x - 512;
		dx *= -1;
		theta = Math.atan2 (dy, dx) / 3.14159 * 180;
		if (theta < 0) theta += 360;
		d = Math.sqrt (dx*dx + dy*dy);
		//widthLat = Db1.mapC.mapObject.width;
		widthLat = Db1.mapC.mapObject.get ("width");
		r = d/512.0 * widthLat;

		// North Pole
		if (Db1.mapC.whichPole == "NPole") {
			gLon = 180 - theta;
			if (gLon > 360) gLon -= 360;
			//Iapetus
			//gLon = 360 - gLon;
			gLat = 90 - r;
		}//if N	

		// South Pole
		else {
			gLon = theta;
			gLat = -90 + r
		}//if S
	}//
	
	// Normal - Equator
	else {
		gLat = (1024-y)/1024 * 180 - 90;
		gLon = x/2048 * 360;
		gLon += lonStart;
	}//else

	coordSystem = Db1.mapC.get('g_coord');
	if (coordSystem == "West360") {
		gLon = 360 - gLon;
	}//if

	if (gLon > 360) gLon -= 360;
	if (gLon < 0) gLon += 360;
},//tolat

//---------------------------
toX: function (lon, lat) {
	if (! Db1.mapC) return;
	if (lon < 0) lon += 360;
	lonStart = parseFloat (Db1.mapC.get('mapStart'));
	coordSystem = Db1.mapC.get('g_coord');
	
	switch (Db1.mapC.g_target) {
		case "Vesta": 
		switch (Db1.mapC.g_organization) {
			case "PDS":
			break;
		}//switch
		break;
	}//switch

	if (Db1.mapC.g_target == "Iapetus") {
      gX = lon/360*2048;
      gX += 1024;
      if (gX > 2048) gX -= 2048;
      gY = ( (90-lat)/180 * 1024 );
		return;
	}//

	if (Db1.mapC.get ('pole')) {
		gX = 0;
		gY = 0;
		widthLat = Db1.mapC.mapObject.get ("width");

		// North pole
		if (Db1.mapC.whichPole == "NPole") {
			r = 90 - lat;
			d = r/widthLat * 512;
			lon = 360 - lon;
			rLon = (lon-180)/180.0 * 3.14159;
		}//if N pole

		// South pole
		else {
			r = lat + 90;
			d = r/widthLat * 512;
			rLon = lon/180.0 * 3.14159;
			
		}//S pole
		dy = d* Math.cos (rLon);			// opposit function to translate
		dx = d* Math.sin (rLon);			// opposit function to translate

		dy *= -1;
		gX = 512+dx;
		gY = 512+dy;

	}//if
	else {			
	// Equator
		lon -= lonStart;
		if (coordSystem == "West360") lon = 360 - lon;
		if (lon < 0) lon += 360;
		gX = lon/360*2048;
		//gX += 1024;
		//if (gX > 2048) gX -= 2048;
		gY = ( (90.0-lat)/180.0 * 1024 );
	}//else
},//tox

//---------------------------
// not tested - 
isPointInPoly: function (poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;

},//

//---------------------------
drawObs: function (obs) {
	if (! obs) return;
	if (Db1.mapC.pole) {
		holdx = 512;
		holdy = 512;
		return;		// don't display grey "general" box for polar view
	}//if
	var canvas = this.$('canvas')[0]; // using CoreQuery here.
	var ctx = canvas.getContext("2d");
	ctx.strokeStyle = "rgb(0,255,255)";			// grey
	ctx.beginPath();

	index = Db1.obsCont.indexOf(obs);
	//if (index) ctx.strokeStyle = "rgb(0,255,0)";	// gree

	var minLat = obs.get('MinLat');
	var maxLat = obs.get('MaxLat');
	var minLon = obs.get('MinLon');
	var maxLon = obs.get('MaxLon');


    var x = minLon/360*2048;
    x += 1024;
    if (x > 2048) x-= 2048;
    var y = ( (90-minLat)/180 * 1024 );

    var x2 = maxLon/360*2048;
    x2 += 1024;
    if (x2 > 2048) x2-= 2048;
    y2 = ( (90-maxLat)/180 * 1024 );

    var w = x2 - x;
    var h = y2 - y;

    if (w < 0) {			// wrap
      var w2 = 2048 - x;
      ctx.strokeRect(x,y,w2,h);
      x = 1;
      w = x2;
    }//if
      
	holdx = x;
	holdy = y;
	ctx.strokeRect(x,y,w,h);
	ctx.stroke();


},//drawobs

//------------------------------------------
drawObs2L: function (footA, ctx) {
	if (! Db1.mapC) return;
	normal = true;;

	//if (Db1.mapC.g_coord == "Vesta-IAU") gX -= 150.7/360.0 * 2048;
	lonStart = parseFloat (Db1.mapC.get('mapStart'));

	footA.forEach ( function (item) {
		coordA = item.split (" ");
		if (coordA [0] == 1000)	 normal = false;			// invalid and 2nd footprint
		//if (coordA [0] == "")	 skipF = true;			// invalid and 2nd footprint

		tLon = parseFloat (coordA[0]);
		tLat = parseFloat (coordA[1]);

		if (Db1.mapC.pole) {
			//if (Db1.mapC.g_target == "Iapetus") tLon += 150.7
			g_baseV.toX (tLon, tLat);
		}//if
		else {			// calculate by hand and deal with wrap
    		gX = tLon/360*2048;
			gX -= lonStart / 360.0 * 2048;
			if (Db1.mapC.g_target == "Iapetus") gX += 1024;
    		gY = ( (90-tLat)/180 * 1024 );
			//gX -= lonStart/360.0 * 2048;
		}//else

		if (normal) ctx.lineTo (gX, gY);
		else {
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
			normal = true;
		}//else

	})//foreach
},//drawobs2L

//------------------------------------------
drawObs2R: function (footA, ctx) {
	if (! Db1.mapC) return;
	lonStart = parseFloat (Db1.mapC.get('mapStart'));

	var normal = false;	
	var oldX = 0;
	footA.forEach ( function (item) {
		coordA = item.split (" ");
		if (coordA [0] == 1000)	 normal = false;			
		if (coordA [0] == "")	 skipF = true;			// invalid and 2nd footprint
	
		tLon = parseFloat (coordA[0]);
		tLat = parseFloat (coordA[1]);

		if (Db1.mapC.pole){
			//if (Db1.mapC.g_target == "Iapetus") tLon += 150.7
			g_baseV.toX (tLon, tLat);
		}//if
		else {			// calculate by hand and deal with wrap
    		gX = tLon/360*2048;
			gX -= lonStart / 360.0 * 2048;
			if (Db1.mapC.g_target == "Iapetus") gX -= 1024;
    		gY = ( (90-tLat)/180 * 1024 );
			//gX -= lonStart/360.0 * 2048;
			gX += 2048;
		}//else

		if (normal) ctx.lineTo (gX, gY);
		else {
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
			normal = true;
		}//if2

	})//foreach
},//drawobs2L

//------------------------------------------
drawQuad: function (ctx) {

	var eq = 1024/2;
	var lat = 512;
	var lon = 2048
	if (Db1.mapC.pole) return;
	if (Db1.mapC.g_coord == "Vesta-IAU") offset = 150.7
	else offset = 0;

	ctx.strokeStyle = "rgb(255,255,0)";
	ctx.beginPath();
	
	this.toX (0+offset, 22);
	ctx.moveTo (0, gY);
	ctx.lineTo (lon, gY);
	this.toX (0+offset, -22);
	ctx.moveTo (0, gY);
	ctx.lineTo (lon, gY);

	this.toX (0+offset, 66);
	ctx.moveTo (0, gY);
	ctx.lineTo (lon, gY);
	this.toX (0+offset, -66);
	ctx.moveTo (0, gY);
	ctx.lineTo (lon, gY);

	// North
	for (i=0; i<360; i+=90) {
		this.toX (i+offset, 22);
		startY = gY;
		this.toX (i+offset, 66);
		ctx.moveTo (gX, startY);
		ctx.lineTo (gX, gY);
	}//for
	// South
	for (i=0; i<360; i+=90) {
		this.toX (i+offset, -22);
		startY = gY;
		this.toX (i+offset, -66);
		ctx.moveTo (gX, startY);
		ctx.lineTo (gX, gY);
	}//for

	// Center
	for (i=0; i<360; i+=72) {
		this.toX (i+offset, -22);
		startY = gY;
		this.toX (i+offset, 22);
		ctx.moveTo (gX, startY);
		ctx.lineTo (gX, gY);
	}//for

	if (g_rootV.obsTitleB.value) {
		ctx.fillStyle = "rgb(255,255,255)";		// white
		ctx.font = "14px times";
		
		
		this.toX (1+offset,-20); ctx.fillText ("V-6EE", gX, gY);
		this.toX (73+offset,-20); ctx.fillText ("V-7EFE", gX, gY);
		this.toX (145+offset,-20); ctx.fillText ("V-8EDL", gX, gY);
		this.toX (217+offset,-20); ctx.fillText ("V-9EFW", gX, gY);
		this.toX (289+offset,-20); ctx.fillText ("V-10EW", gX, gY);
		this.toX (1+offset,23); ctx.fillText ("V-2NE", gX, gY);
		this.toX (91+offset,23); ctx.fillText ("V-3NFE", gX, gY);
		this.toX (181+offset,23); ctx.fillText ("V-4NFW", gX, gY);
		this.toX (271+offset,23); ctx.fillText ("V-5NW", gX, gY);
		this.toX (1+offset,-25); ctx.fillText ("V-11SE", gX, gY);
		this.toX (91+offset,-25); ctx.fillText ("V-12SFE", gX, gY);
		this.toX (181+offset,-25); ctx.fillText ("V-13SFW", gX, gY);
		this.toX (271+offset,-25); ctx.fillText ("V-14SW", gX, gY);
		this.toX (0+offset,67); ctx.fillText ("V-1NP", gX, gY);
		this.toX (0+offset, -67); ctx.fillText ("V-15SP", gX, gY);
		ctx.stroke();
	}//if

	ctx.stroke();

},//draquad

//------------------------------------------
drawFeatures: function (ctx) {
	ctx.beginPath();
	ctx.strokeStyle = "rgb(255,255,0)";
	ctx.fillStyle = "rgb(255,255,255)";		// white
	ctx.font = "14px times";

	count = 1;
	featureA.forEach (function (item) {
		count += 1;
		a = parseFloat (item.get ('CenterLon'));
		b = parseFloat (item.get ('CenterLat'));
		var name = item.get ('name');
		g_baseV.toX (a, b)
		ctx.fillText (name, gX, gY);
		ctx.stroke();
	});//foreach

	ctx.stroke();

},//draquad


//------------------------------------------
drawPole: function (ctx) {
	var lat
	if (Db1.mapC.whichPole == "NPole") lat = 88;
	else lat = -88;
		
	ctx.beginPath();
	ctx.strokeStyle = "rgb(200,200,200)";		// gray

	// Draw longitude lines
	var lon
	for (lon=0; lon<360; lon+=30) {
		this.toX (lon,lat)				// center
		ctx.moveTo (gX, gY);
		this.toX (lon,45)				// outside the view
		ctx.lineTo (gX, gY);
	}//for
	ctx.stroke();

	// Draw latitude circles
	ctx.beginPath();
	ctx.strokeStyle = "rgb(200,200,200)";		// gray
	if (Db1.mapC.whichPole == "NPole") {
		for (lat=45; lat<90; lat+=5) {
/*
			if (Db1.mapC.g_coord == "Vesta-IAU") 
				this.toX (90.0+150.7, lat); // do the math on the horizonal
			else
				this.toX (90.0, lat); // do the math on the horizonal
*/
			this.toX (90.0, lat); // do the math on the horizonal
			radius = gX - 512;
			//ctx.moveTo (gX, gY);
			ctx.arc (512, 512, radius, 0, 2*3.1415926, false);
		}//for
	} else {
		for (lat=-45; lat>-90; lat-=5) {
			this.toX (90+150.7, lat); // do the math on the horizonal
/*
			if (Db1.mapC.g_coord == "Vesta-IAU") 
				this.toX (90.0+150.7, lat); // do the math on the horizonal
			else
				this.toX (90.0, lat); // do the math on the horizonal
*/
			this.toX (90.0, lat); // do the math on the horizonal
			radius = gX - 512;
			ctx.moveTo (gX, gY);
			ctx.arc (512, 512, radius, 0, 2*3.1415926, false);
		}//for
	}//if
	ctx.stroke();

	// Display text labels
	if (g_rootV.obsTitleB.value) {
		if (Db1.mapC.whichPole == "NPole") lat = 61;
		else lat = -61;
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.font = "16px times";
		this.toX (2,lat); ctx.fillText ("0", gX, gY);
		this.toX (90,lat+2); ctx.fillText ("90", gX, gY);
		this.toX (180+2,lat); ctx.fillText ("180", gX, gY);
		this.toX (270,lat+2); ctx.fillText ("270", gX, gY);

		// Label everything from -90 to 90, but only what is needed shows
		for (lat=-85; lat<90; lat+=5) {
			this.toX (45,lat); ctx.fillText (lat, gX, gY);
		}
	}//if
},

//------------------------------------------
// Draw grid lines
drawGrid: function (ctx) {
	if (! Db1.mapC) return;

		ctx.beginPath();
		ctx.strokeStyle = "rgb(0,0,0)";
		var l;
		for (l=0; l<360; l+=30) {
			this.toX (l,-90)
			ctx.moveTo (gX, 0);
			ctx.lineTo (gX, gY);
		}//for
		for (l=-90; l<90; l+=30) {
			this.toX (180,l)
			ctx.moveTo (0, gY);
			ctx.lineTo (2048, gY);
		}//for

		// Text labels
		if (g_rootV.obsTitleB.value) {
			ctx.fillStyle = "rgb(255,255,255)";
			ctx.font = "16px times";
			this.toX (1,1); ctx.fillText ("0,0", gX, gY);
			this.toX (1,31); ctx.fillText ("0,30", gX, gY);
			this.toX (1,-31); ctx.fillText ("0,-30", gX, gY);
			this.toX (1,61); ctx.fillText ("0,60", gX, gY);
			this.toX (1,-61); ctx.fillText ("0,-60", gX, gY);
			this.toX (91,1); ctx.fillText ("90,0", gX, gY);
			this.toX (181,1); ctx.fillText ("180,0", gX, gY);
			if (Db1.mapC.get('mapStart') == "180,0")
				{ this.toX (173,1); ctx.fillText ("180,0", gX, gY);}
			else
				{ this.toX (358,1); ctx.fillText ("0,0", gX, gY);}
			this.toX (270,1); ctx.fillText ("270,0", gX, gY);
		}
		ctx.stroke();
},

//------------------------------------------
drawStuff: function () {
	//if (! Db1.mapC) return;
	g_baseV = Db1.mainPage.mainPane.scrollV.contentView.mapV.contentView.drawingView;
	g_rootV = Db1.mainPage.mainPane.scrollV.contentView;

	var canvas = this.$('canvas')[0]; // using CoreQuery here.
	var ctx = canvas.getContext("2d");
	ctx.clearRect (0, 0, 2048, 1024);

	if (g_rootV.gridB.value) 
		if (Db1.mapC.pole) this.drawPole(ctx);
		else this.drawGrid(ctx);

	tLon = parseFloat (Db1.obsCont.get('longtitude'));
	tLat = parseFloat (Db1.obsCont.get('latitude'));
	this.toX (tLon, tLat);
	holdX = gX;
	holdY = gY;

	//if (g_rootV.quadB.value) this.drawQuad (ctx);
	if (g_rootV.featureB.value) this.drawFeatures (ctx);

	// Draw observation footprints
	selA = Db1.obsCont.get('selection');
	selA.forEach ( function (item) {
		// Used for drawing only min/max Lat/Lon
    	 //g_baseV.drawObs(item);

		if (g_rootV.subSolarB.value)  {
		if (item)  {
			ctx.fillStyle = "rgb(255,255,0)";  		//yellow
			ctx.strokeSytle = "rgb(255,255,0)";  		//yellow
			sunLat = item.get('sunLat');				// get position
			sunLon = item.get('sunLon');
			g_baseV.toX (sunLon, sunLat);  
 			circle = new Path2D();
    		circle.arc(gX, gY, 15, 0, 2 * Math.PI);
    		ctx.fill(circle);
			/*
			m1 = item.get('MinLat');					// get start
			m2 = item.get('MinLon');
			g_baseV.toX (m2, m1);  
			mX = gX; mY = gY;
    		ctx.beginPath();
			ctx.moveTo (mX, mY);
			ctx.lineTo (gX, gY);
			ctx.closePath();
			ctx.stroke();
			*/

																// Draw Spacecraft
			ctx.fillStyle = "rgb(192, 192, 192)"; 	//silver
			ctx.strokeStyle = "rgb(192, 192, 192)"; 	//silver
			spaceLat = item.get('spaceLat');
			spaceLon = item.get('spaceLon');
			g_baseV.toX (spaceLon, spaceLat); 
			ctx.stroke();
    		ctx.fillRect(gX - 10, gY - 10, 20, 20);
			/*
    		ctx.beginPath();
			ctx.moveTo (mX, mY);
			ctx.lineTo (gX, gY);
			ctx.closePath();
			*/
		}//if
		}//ifsubsolar
	
		// Used for drawing the real footprints
		if (item) footStr = item.get('Footprint');
		else {
			footStr = 0;
			console.log ("trigger - should not see");
		}//else

		if (footStr) {
			footA = footStr.split(", ");
			ctx.beginPath();
			if (item.inPoly)
				ctx.strokeStyle = "rgb(0,255,255)"; // cyan
			else {
				iName = item.get('ImageName');
				if (iName [0] == "N")
					ctx.strokeStyle = "rgb(0,255,0)"; // green
				else
					ctx.strokeStyle = "rgb(255,255,255)"; // white
				//ctx.strokeStyle = "rgb(255,255,255)"; // white
			}//else
    		g_baseV.drawObs2L(footA, ctx);
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
    		g_baseV.drawObs2R(footA, ctx);
			ctx.closePath();
			ctx.stroke();
			if (g_rootV.obsTitleB.value) {		// Cube titles
				ctx.beginPath();
				ctx.fillStyle = "rgb(255,10,10)";		// red'ish
				ctx.fillStyle = "rgb(0,0,0)";		// red'ish
				ctx.font = "14px times";
				var minLat = item.get('MinLat');
				var minLon = item.get('MinLon');
				g_baseV.toX (minLon, minLat);
				ctx.fillText (item.get('ImageName'), gX, gY);
				ctx.stroke();
			}//if value
		}//if footstr
    });//foreach

	// Draw a box for selection
	if (Db1.mapC.moveX != 0) {
    	ctx.beginPath();
    	ctx.strokeStyle = "rgb(255, 0, 0)";		// red
    	ctx.moveTo (Db1.mapC.clickX, Db1.mapC.clickY);
    	ctx.lineTo (Db1.mapC.clickX, Db1.mapC.moveY);
    	ctx.lineTo (Db1.mapC.moveX, Db1.mapC.moveY);
    	ctx.lineTo (Db1.mapC.moveX, Db1.mapC.clickY);
    	ctx.lineTo (Db1.mapC.clickX, Db1.mapC.clickY);
    	ctx.stroke();
	}//ifmovex
	else {
	// Draw the "X" location
    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 0, 0)";		// red
    ctx.moveTo (holdX-5,holdY-5);
    ctx.lineTo (holdX+5, holdY+5);
    ctx.moveTo (holdX-5, holdY+5);
    ctx.lineTo (holdX+5, holdY-5);
    ctx.stroke();
	}//elsemove


	ctx = canvas = null ; // avoid memory leaks  },

}//drawstuff

});



// This page describes the main user interface for your application.  
Db1.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
		childViews: 'scrollV'.w(),
  		scrollV: SC.ScrollView.design({
			classNames: ['clock'],
      	contentView: SC.View.design({
      	layout: { left: 0, top: 0, minWidth: 1080, minHeight: 815 },
			   childViews: 'labelView mapV listV   aboutB imgList versT selectAllB  selectNoneB   mapM previewV currentV currentT  controlV  exportV  numT gridB featureB  olarB obsTitleB selectL mapL previewL cameraB '.w(),
				// needed for ORex SPC
			   //childViews: 'labelView mapV listV   aboutB imgList versT selectAllB  selectNoneB   mapM previewV currentV currentT  controlV  exportV  numT gridB featureB  subSolarB obsTitleB selectL mapL previewL cameraB '.w(),
    
//-----------------
// Preview Window
	previewV:  SC.ScrollView.design({
		layout: { right: 5, top: 5, width: 520, height: 520 },
      contentView: SC.ImageView.design({
		backgroundColor: "green",
		valueBinding: "Db1.mapC.previewImg",
      })//contentview
   }),//imgview

	currentT:  SC.LabelView.design({
		layout: { right: 40, top: 180, width: 450, height: 150 },
		backgroundColor: "yellow",
		classNames: "current",
		escapeHTML: NO,
		textAlign: SC.ALIGN_CENTER,
		fontWeight: SC.BOLD_WEIGHT,
		tagName: "h1",
		valueBinding: "Db1.obsCont.currentT",
   }),//currentt

	currentV:  SC.LabelView.design({
		layout: { right: 35, top: 185, width: 450, height: 150 },
		backgroundColor: "orange",
   }),//currentt

//-----------------
// Main map window
   mapV:  SC.ScrollView.design({
      layout: { left: 5, top: 5, right: 530, bottom: 290, minHeight: 520 },
      contentView: SC.View.design({
         layout: {top:0, height: 1024, left: 0, width:2048 },
         childViews: 'poleImgView mainImgView drawingView '.w(),
         mainImgView: SC.ImageView.design({
         	layout: {top:0, height: 1024, left: 0, width:2048 },
				value: "/data/",		// place holder, set in main.js
         }),//mainimgview
         poleImgView: SC.ImageView.design({
				//value: "/data/" + g_pathStr + "/ref_maps/Pole-dlr-Aug.png",
         	layout: {top:0, height: 1024, left: 0, width:1024 },
				//isVisibleBinding: "Db1.mapC.pole",
         }),//mainimgview
         drawingView: DrawingClass.design({
         })//drawingview
      })//contentview
   }),//imgview

    listV:SC.TableView.extend ({
    //listV:SC.TableView.design ({
    	layout: { left: 5, bottom: 5, right: 455, height: 230 },
		hasHorizontalScroller: YES,
		isSortable: YES,
     	columns: obsColumn,
     	backgroundColor: "Gray",
     	contentBinding: "Db1.obsCont.arrangedObjects",
     	selectionBinding: "Db1.obsCont.selection",
     	sortedColumnBinding: 'Db1.obsCont.sortedColumn',
     	selectOnMouseDown: YES,
     	exampleView: SC.TableRowView,
    	recordType: Db1.obsCont,
		target: "Db1.obsCont",
		action: "click",
		actOnSelect: YES,
      delegate: SC.TableDelegate,
    	}),

  //}),//listV


// Footprint
  selectL: SC.LabelView.design({
   layout: { left: 50, bottom: 270, width: 100, height: 18 },
	value: "Footprints",
  }),
  selectAllB: SC.ButtonView.design({
    layout: { left: 20, bottom: 245, width: 50, height: 24 },
    title: "All",
    target: "Db1.obsCont",
    action: "selectAllE",
  }),
  selectNoneB: SC.ButtonView.design({
    layout: { left: 80, bottom: 245, width: 50, height: 24 },
    title: "None",
    target: "Db1.obsCont",
    action: "selectNoneE",
  }),

// Map info and selection
  mapL: SC.LabelView.design({
   layout: { left: 160, bottom: 270, width: 100, height: 18 },
	value: "Change Map",
  }),
	mapM: SC.PopupButtonView.design({
		layout: { left: 135, bottom: 245, width: 130, height: 24 },
		menuBinding: "Db1.mapC.menu",
		titleBinding: "Db1.mapC.mapName",
	}),

  // export layout
	exportV: SC.View.design ({
   layout: { right: 111, top: 525, width: 414, height: 56 },
   childViews: 'ex_cL ex_c1 ex_c2 ex_iL ex_i1 ex_i2 ex_eL ex_e1 ex_e2 ex_oL ex_o1 ex_o2 boxV'.w(),

  	boxV: SC.LabelView.design({
   	layout: { left: 0, top: 17, right: 5, height: 1 },
		backgroundColor: 'black',
  	}),
  	ex_cL: SC.LabelView.design({
   	layout: { left: 0, top: 0, width: 180, height: 17 },
		valueBinding: "Db1.obsCont.imageL",
		backgroundColor: 'grey',
  	}),
  	ex_c1: SC.LabelView.design({
   	layout: { left: 0, top: 18, width: 180, height: 17 },
		escapeHTML: NO,
		valueBinding: "Db1.obsCont.image1",
  	}),
  	ex_c2: SC.LabelView.design({
   	layout: { left: 0, top: 36, width: 180, height: 17 },
		escapeHTML: NO,
		valueBinding: "Db1.obsCont.image2",
  	}),
  	ex_iL: SC.LabelView.design({
   	layout: { left: 185, top: 0, width: 100, height: 17 },
		valueBinding: "Db1.obsCont.cubeL",
		escapeHTML: NO,
		backgroundColor: "grey",
  	}),
  	ex_i1: SC.LabelView.design({
   	layout: { left: 180, top: 18, width: 100, height: 17 },
		escapeHTML: NO,
		valueBinding: "Db1.obsCont.cube1",
  	}),
  	ex_i2: SC.LabelView.design({
   	layout: { left: 180, top: 36, width: 100, height: 17 },
		escapeHTML: NO,
		valueBinding: "Db1.obsCont.cube2",
  	}),
  	ex_eL: SC.LabelView.design({
   	layout: { left: 270, top: 0, width: 85, height: 17 },
		valueBinding: "Db1.obsCont.sourceL",
		backgroundColor: "grey",
  	}),
  	ex_e1: SC.LabelView.design({
   	layout: { left: 270, top: 18, width: 85, height: 17 },
		escapeHTML: NO,
		valueBinding: "Db1.obsCont.source1",
  	}),
  	ex_e2: SC.LabelView.design({
   	layout: { left: 270, top: 36, width: 85, height: 17 },
		escapeHTML: NO,
		valueBinding: "Db1.obsCont.source2",
  	}),
  	ex_oL: SC.LabelView.design({
   	layout: { left: 360, top: 0, width: 105, height: 17 },
		valueBinding: "Db1.obsCont.otherL",
		backgroundColor: "grey",
  	}),
  	ex_o1: SC.LabelView.design({
   	layout: { left: 360, top: 18, width: 105, height: 17 },
		escapeHTML: NO,
		valueBinding: "Db1.obsCont.other1",
  	}),
  	ex_o2: SC.LabelView.design({
   	layout: { left: 360, top: 36, width: 65, height: 17 },
		escapeHTML: NO,
		valueBinding: "Db1.obsCont.other2",
  	}),
  }),

// Map display options
	gridB: SC.CheckboxView.design({
      layout: { left: 270, bottom: 250, width: 60, height: 24 },
      title: "Grid",
	   target: "Db1.obsCont",
	   action: "gridE",
		value: false,
	}),
	obsTitleB: SC.CheckboxView.design({
      layout: { left: 270, bottom: 230, width: 60, height: 24 },
      title: "Titles",
	   target: "Db1.obsCont",
	   action: "obsTitleE",
		value: false,
	}),
	subSolarB: SC.CheckboxView.design({
      layout: { left: 330, bottom: 250, width: 60, height: 24 },
      title: "SubSolar",
	   target: "Db1.obsCont",
	   action: "subSolarE",
	}),
	featureB: SC.CheckboxView.design({
      layout: { left: 330, bottom: 230, width: 70, height: 24 },
      title: "Features",
	   target: "Db1.obsCont",
	   action: "featuresE",
	}),

//--------------------------
// Data info
	//mapM: SC.PopupButtonView.design({
	// Not implemented yet
  	configB: SC.PopupButtonView.design({
    	layout: { left: 360, bottom: 270, width: 115, height: 24 },
		icon: 'sc-icon-options-24',
    	title: "Configure",
		//menuBinding: "Db1.mapC.configM",
    	//target: "Db1.mapCont",
    	//action: "configM",
  	}),

  	aboutB: SC.ButtonView.design({
    	layout: { left: 410, bottom: 250, width: 55, height: 24 },
    	title: "About",
    	target: "Db1.obsCont",
    	action: "aboutE",
  	}),

  	imgList: SC.ButtonView.design({
    	layout: { left: 530, bottom: 250, width: 75, height: 24 },
    	title: "Download",
    	target: "Db1.list",
    	action: "execute",
  	}),

	numT: SC.LabelView.design({
		layout: { left: 470, bottom: 270, width: 80, height: 15 },
		escapeHTML: NO,
		valueBinding: "Db1.obsCont.countT",
	}),
  	versT: SC.LabelView.design({
    	layout: { left: 470, bottom: 245, width: 80, height: 20 },
    	valueBinding: "Db1.obsCont.version",
  	}),



    labelView: SC.LabelView.design({
		layout: { right: 5, top: 640, width: 448, bottom: 5 },
      textAlign: SC.ALIGN_CENTER,
      value: "Loading Data - please wait"
    }),

//--------------------------
// Search controls
    controlV:  SC.View.design({
		childViews: 'limitL rezL rezT instL  instMEros instMDawn instMNewF instM   exB allB latL lonL latT lonT obsList nameT nameL nameB '.w(),
		backgroundColor:  "white",
		layout: { right: 5, top: 580, width: 448, bottom: 5 },
		isVisible: false,

   	obsList:  SC.ScrollView.extend({
			classNames: ['my-scroll-view'],
			layout: { left: 200, top: 70, right: 10, bottom: 3 },

   		contentView:  SC.ListView.extend({
				classNames: ['my-list-view'],
            rowHeight: 24,
				backgroundColor: "white",
				contentBinding: 'Db1.sequenceCont.arrangedObjects',
				selectionBinding: 'Db1.sequenceCont.selection',
				target: "Db1.obsCont",
				action: "seqSelectedE",
   		exampleView:  SC.ListItemView.extend({
				hasContentIcon: true,
				contentIconKey: 'icon',
				contentCheckboxKey: 'useMe',
				contentValueKey: 'name',
			}),
			}),//content
   	}),//obslist

      latL: SC.LabelView.design({
        layout: { left: 10, top: 75, width: 80, height: 18 },
        value: "Latitude"
      }),

      lonL: SC.LabelView.design({
        layout: { left: 100, top: 75, width: 80, height: 18 },
        value: "Longitude"
      }),

      latT: SC.TextFieldView.design({
        layout: { left: 10, top: 95, width: 80, height: 24 },
        valueBinding: "Db1.obsCont.latitude"
      }),

      lonT: SC.TextFieldView.design({
        layout: { left: 100, top: 95, width: 80, height: 24 },
        valueBinding: "Db1.obsCont.longtitude"
      }),

      limitL: SC.LabelView.design({
        layout: { left: 60, top: 125, width: 80, height: 24 },
        value: "Limit By:"
      }),

      rezL: SC.LabelView.design({
        layout: { left: 10, top: 180, width: 100, height: 24 },
        value: "Resolution (m)"
      }),

      rezT: SC.TextFieldView.design({
        layout: { left: 100, top: 180, width: 80, height: 24 },
        valueBinding: "Db1.obsCont.Resolution"
      }),

      instL: SC.LabelView.design({
        layout: { left: 10, top: 150, width: 100, height: 18 },
        value: "Instrument"
      }),

      instM: SC.PopupButtonView.design({
        layout: { left: 100, top: 150, width: 80, height: 20 },
			menuBinding: "Db1.inst.menu",
			backgroundColor: "white",
			titleBinding: "Db1.obsCont.instrument",
      }),

      instMEros: SC.PopupButtonView.design({
        layout: { left: 100, top: 150, width: 80, height: 20 },
			menuBinding: "Db1.eros.menu",
			backgroundColor: "white",
			titleBinding: "Db1.obsCont.instrument",
      }),

      instMDawn: SC.PopupButtonView.design({
        layout: { left: 100, top: 150, width: 80, height: 20 },
			menuBinding: "Db1.dawn.menu",
			backgroundColor: "white",
			titleBinding: "Db1.obsCont.instrument",
      }),

      instMNewF: SC.PopupButtonView.design({
        layout: { left: 100, top: 150, width: 80, height: 20 },
			menuBinding: "Db1.newF.menu",
			backgroundColor: "white",
			titleBinding: "Db1.obsCont.instrument",
      }),

      instMNewF: SC.PopupButtonView.design({
        layout: { left: 100, top: 150, width: 80, height: 20 },
			menuBinding: "Db1.ocams.menu",
			titleBinding: "Db1.obsCont.instrument",
      }),

      phaseL: SC.LabelView.design({
        layout: { left: 10, top: 150, width: 100, height: 20 },
        value: "Phase"
      }),

      phaseM: SC.PopupButtonView.design({
        layout: { left: 80, top: 150, width: 80, height: 20 },
			menuBinding: "Db1.phaseC.menu",
			backgroundColor: "white",
			titleBinding: "Db1.obsCont.selPhase"
      }),

      exB: SC.ButtonView.design({
			layout: { left: 50, top: 45, width: 100, height: 24 },
			title: "Search",
			target: "Db1.obsCont",
			action: "executeE",
      }),

      allB: SC.ButtonView.design({
        layout: { left: 250, top: 45, width: 150, height: 24 },
        title: "Show Sequence",
			target: "Db1.obsCont",
			action: "showAllE",
      }),

      nameB: SC.ButtonView.design({
        layout: { left: 10, top: 10, width: 130, height: 24 },
        title: "Search Name",
			target: "Db1.obsCont",
			action: "nameE",
      }),

      nameT: SC.TextFieldView.design({
        layout: { left: 150, top: 10, width: 180, height: 24 },
        valueBinding: "Db1.obsCont.searchName"
      }),

      nameL: SC.LabelView.design({
        layout: { left: 330, top: 10, width: 180, height: 24 },
        value: "Type - don't paste"
      }),

    }),

	//--------------------------
  	openImgB: SC.ButtonView.design({
    	layout: { right: 60, top: 545, width: 90, height: 24 },
    	title: "Open Image",
    	target: "Db1.obsCont",
    	action: "openImgE",
  	}),

  	openInfoB: SC.ButtonView.design({
    	layout: { right: 150, top: 545, width: 40, height: 24 },
    	title: "Info",
    	target: "Db1.obsCont",
    	action: "openInfoE",
  	}),


      previewL: SC.LabelView.design({
        layout: { right: 10, top: 523, width: 100, height: 20 },
        value: "Image Preview"
      }),
      cameraB: SC.RadioView.design({
			layout: { right: 10, top: 540, width: 80, height: 50 },
			target: "Db1.obsCont",
			action: "cameraE",
			layoutDirection: SC.LAYOUT_HORIZONTAL,
			items: [
				{ title: "Frame"},
				{ title: "Projected"} 
			],
			valueBinding: 'Db1.obsCont.camera',
			itemTitleKey: 'title',
			itemValueKey: 'title'
      }),
  })
})
})

});
