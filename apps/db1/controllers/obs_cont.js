// ==========================================================================
// Project:   Db1.obsCont
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Db1 */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
Db1.obsCont = SC.ArrayController.create(
/** @scope Db1.obsCont.prototype */ {

    pane: null,

instrument: "All",
selPhase: "All",
timeSt: "",
timeEnd: "",
phaseSt: "",
phaseEnd: "",
Resolution: "",
latitude: "30.000",
longtitude: "270.0",
currentImage: "",
camera: "Frame",
uncal: "Uncal",
cubeL: "ISIS",
cube1: "",
cube2: "",
imageL: "PNG TIF JPG",
image1: "",
image2: "",
image3: "",
image4: "",
sourceL: "Source",
source1: "",
source2: "",
otherL: "Other",
other1: "",
other2: "",
raw: "",
pgw: "pgw",
info: "info",
imgPath: "http://www.psi.edu",
infoPath: "http://www.psi.edu",
progressStr: "Loading Observations",
progress: 0,
mapName: "Gaskel-PreLAMO.png",
countT: "0/0",
//currentT: "<BR><BR>Loading Meta Data",

ceresImg: [
	{ title: "ISIS Cubes", pre1: "frame/cub/", pre2: "map/cub/", post: ".cub", name1: "Frame", name2: "Projected" },
	{ title: "IMG", pre1: "frame/1A/", pre2: "frame/1B/", post: ".IMG", name1: "1A", name2: "1B" },
	{ title: "FITS", pre1: "frame/fits/", pre2: "frame/wfits/", post: ".tar", name1: "1A", name2: "1B" },
	{ title: "GeoTif", pre1: "frame/tif/", pre2: "map/tif/", post: ".tif", name1: "Frame", name2: "Projected" },
],



//---------------------------------
//---------------------------------
//---------------------------------
beep: function () {
	this.click();
}.observes ('Db1.obsCont.selection'),

click: function () {
  selA = Db1.obsCont.selection();
  if (! selA) return;
  first = selA.firstObject();
  if (! first) return;

	g_rootV.currentT.set ('isVisible', false);
	g_rootV.currentV.set ('isVisible', false);

	Db1.obsCont.set ('otherL', "");
	Db1.obsCont.set ('other1', "");
	Db1.obsCont.set ('other2', "");

	name = first.get('file_name'); 
	level = first.get('Level'); 
	Db1.obsCont.set ('currentImage', first);
	phase = "phase";
	thumb = "sequence";
	subPath2 = "type";

	phase = first.get('MissionPhase');
	thumb = first.get('Thumb');
	inst = first.get('instrument');

	// set variables that are based on which type of image to display
	lay = {height: 512, width: 512};
	//scale = 2;
/*
	scale = 1;
	if (first.get('lines') > 1000) scale = .49;
	if (first.get('lines') == 1000) scale = .49;
*/

	// set scale based on largest direction
	if (Db1.obsCont.get('camera') == "Frame")  {
		sam = Number (first.get('f_samples')) ;
		lines = Number (first.get('f_lines') )
	} else {
		sam = Number (first.get('samples'))
		lines = Number (first.get('lines') )
	}//if-else frame

	if (sam > lines) biggest = sam
	else biggest = lines

	scale = 512 / biggest


/*
	if (sam > lines) lines = sam;
	scale = 512 / lines;;
*/

	if (Db1.obsCont.get('camera') == "Frame") {
		subPath2 = "frame";
		lay = {height: first.get('f_lines')*scale, width: first.get('f_samples')*scale};
	}//if
	else {
		subPath2 = "maps";
		lay = {height: first.get('lines')*scale, width: first.get('samples')*scale};
	}//else


	// If bad data, use a default
	if (lay.height == 0) {
		lay = {height: 1023, width: 1022};
	}//if

	// If data is Gaskell's shape stuff, use a fixed size
	if (inst == "SPC") lay = {height: 512, width: 512};
	//lay = {height: 512, width: 512};

	// Build Paths
	core = g_subpath + g_pathStr + "/" + phase + "/" + thumb + "-" + inst + "/";
	partCore = g_subpath + g_pathStr + "/" + phase + "/";
	this.imgPath = core + subPath2 + "/png/" + name + ".png";

	// Set up the preview image
	path = core + subPath2 + "/jpg/" + name + ".jpg";
	preV = SC.ImageView.create ({
		value: path,
		layout: lay,
	});

	// Set the preview image
	Db1.mainPage.mainPane.scrollV.contentView.previewV.set ('contentView', preV);
	g_baseV.drawStuff();

	inst_vir = false;
	inst = first.get('instrument');
	if (inst == "VIR-IR") inst_vir = true;
	if (inst == "VIR-VIS") inst_vir = true;

	// Set the metadata for the file
	infoPath = core + "frame/camera/info-" + name + ".txt";
	Db1.obsCont.set ('infoPath', infoPath);

	Db1.obsCont.set ('cubeL', "ISIS Cubes" );
	path = "<a href=" + core + "frame/cubes/f-" + name + ".cub.gz>Camera</a>";
	Db1.obsCont.set ('cube1', path);

	path = "<a href=" + core + "maps/cubes/m-" + name + ".cub.gz>Projected</a>";
	Db1.obsCont.set ('cube2', path);

	////////////////////////////////////////////////////////
	////// Images - Standard 
	tif = systemA.firstObject().get('tif');
	//path4 = "<a href=" + core + "frame/camera/info-" + name + ".txt target=_blank>info</a>";
	//Db1.obsCont.set ('imageL', "PNG - TIF - JPG --- " + path4 );


	// Build links for the image portion 
	path1 = "<a href=" + core + "frame/png/" + name + ".png target=_blank>PNG</a>";
	path2 = "<a href=" + core + "frame/tif/" + name + ".tif target=_blank>TIF</a> - ";
	path3 = "<a href=" + core + "frame/jpg/" + name + ".jpg target=_blank>JPG</a>";
	if (tif != "1") path2 = "";	// skip tif if not defined (undo what I just did)
	Db1.obsCont.set ('image1', "Camera   " + path1 + " - " + path2 + path3 );

	path1 = "<a href=" + core + "maps/png/" + name + ".png target=_blank>PNG</a>";
	path2 = "<a href=" + core + "maps/tif/" + name + ".tif target=_blank>TIF</a> - ";
	path3 = "<a href=" + core + "maps/jpg/" + name + ".jpg target=_blank>JPG</a>";
	if (tif != "1") path2 = "";	// skip tif if not defined (undo what I just did)
	Db1.obsCont.set ('image2', "Projected " + path1 + " - " + path2 + path3 );
	
	////////////////////////////////////////////////////////
	////// Build source file links by mission
	Db1.obsCont.set ('imageL', "Images" );
	filenameA = first.get("filenameA");

	////////////////////////////////////////////////////////
	// PDS - Vesta 
	if ( Db1.mapC.g_target == "Vesta") {

		path1 = "<a href=" + partCore + "fits-1A/" + filenameA + ".tar.gz>Raw</a>";
		path2 = "<a href=" + partCore + "fits-1B/" + name + ".tar.gz>Cal</a>";
		Db1.obsCont.set ('source1', "FITS " + path1 + " - " + path2);

		path1 = "<a href=" + partCore + "img-1A/" + filenameA + ".IMG.gz>Raw</a>";
		path2 = "<a href=" + partCore + "img-1B/" + name + ".IMG.gz>Cal</a>";
		Db1.obsCont.set ('source2', "IMG " + path1 + " - " + path2);
	}//pds - Vesta 

	////////////////////////////////////////////////////////
	// PDS - Ceres 
	if ( Db1.mapC.g_target == "Ceres") {
		path1 = "<a href=" + core + "frame/fits-1A/" + filenameA + ".tar.gz>Raw</a>";
		path2 = "<a href=" + core + "frame/fits-1B/" + name + ".tar.gz>Cal</a>";
		Db1.obsCont.set ('source1', "FITS " + path1 + " - " + path2);

		path1 = "<a href=" + core + "frame/img-1A/" + filenameA + ".IMG.gz>Raw</a>";
		path2 = "<a href=" + core + "frame/img-1B/" + name + ".IMG.gz>Cal</a>";
		Db1.obsCont.set ('source2', "IMG " + path1 + " - " + path2);
	}//pds - Vesta 


	////////////////////////////////////////////////////////
	// PDS - Pluto
	if (Db1.mapC.g_target == "Pluto") {
		path1 = "<a href=" + core + "frame/raw/" + filenameA + ".tar.gz>Raw</a>";
		Db1.obsCont.set ('source1', path1 );

		path1 = "<a href=" + core + "frame/calibrated/" + name + ".tar.gz>Calibrated</a>";
		Db1.obsCont.set ('source2', path1 );
	}//pdspluto

	////////////////////////////////////////////////////////
	// PDS - Eros
	if (Db1.mapC.g_target == "Eros") {
		path1 = "<a href=" + core + "frame/raw/" + filenameA + ".tar.gz>Raw</a>";
		Db1.obsCont.set ('source1', path1 );
		path1 = "<a href=" + core + "frame/calibrated/" + name + ".tar.gz>Calibrated</a>";
		Db1.obsCont.set ('source2', path1 );
	}// if eros
	
	////////////////////////////////////////////////////////
	////// Other items 
	////////////////////////////////////////////////////////
	path1 = "<a href=" + core + "frame/camera/info-" + name + ".txt target=_blank>Info</a>";
	Db1.obsCont.set ('other1', path1 );

	// Set up VIR ENVI references
	if (inst_vir) {
		path = "<a href=" + core + "frame/envi/" + name + ".tar.gz>Full</a>";
		Db1.obsCont.set ('other2', path );
	}//ifvir

/*  // old special data types used for the Dawn mission team
	// Remove links that are not needed for the DEM
	// DEM maps
	if (phase == "DEM") {
		path1 = "<a href=" + core + "frame/shade/shade-" + name + ".png>shaded</a>";
		Db1.obsCont.set ('image1', path1 );
		path1 = "<a href=" + core + "frame/png/d-" + name + ".png>png</a>";
		Db1.obsCont.set ('image2', path1 );
		path1 = "<a href=" + core + "frame/raw/" + name + "_DTM.raw.gz>raw-dtm</a>";
		Db1.obsCont.set ('cube1', path1 );

		Db1.obsCont.set ('cube2', "" );

		// Allows display of vector pdf if needed
		if (subPath2 == "frame")
			this.imgPath = core + subPath2 + "/png/d-" + name + ".png";
		else
			this.imgPath = core + subPath2 + "/pdf/" + name + ".pdf";
	}//if

	// Gaskell's albedo maps
	if (phase == "Albedo") {
		path1 = "<a href=" + core + "maps/png/a-" + name + ".png>png</a>";
		Db1.obsCont.set ('otherL', "Gaskell" );
		Db1.obsCont.set ('other1', path1 );
		Db1.obsCont.set ('other2', "" );
		this.imgPath = core + subPath2 + "/png/a-" + name + ".png";

		Db1.obsCont.set ('image2', "" );
		Db1.obsCont.set ('cube1', "" );
		Db1.obsCont.set ('cube2', "" );
	}//if


	// Tosi's temp data
	if (inst == "VIR-IR") {
		topCore = g_subpath + g_pathStr + "/Temp/";
		Db1.obsCont.set ('otherL', "Temp " );
		path4 = "<a href=" + topCore + "/envi/" + name + ".tar.gz target=_blank>ENVI</a>";
		path5 = "<a href=" + topCore + "/cubes/" + name + ".cub.gz target=_blank>ISIS</a>";
		Db1.obsCont.set ('other1', path4 + " - " + path5 );
		path4 = "<a href=" + topCore + "/png/" + name + ".png target=_blank>png</a>";
		path5 = "<a href=" + topCore + "/txt/" + name + ".txt target=_blank>txt</a>";
		Db1.obsCont.set ('other2', path4 + " - " + path5 );
	}//instvirir
*/


},//click

//---------------------------------
addToMe: function (item) {

	// Set the items search i/e based on the current search click
	pi = 3.1415926;
	psi1 = item.get('sunLat') / 180.0 * pi;
	psi2 = tLat / 180.0 * pi;
	lambda21 = (item.get('sunLon') - tLon ) / 180.0 * pi;
	cosi = Math.sin(psi1) * Math.sin(psi2) + Math.cos(psi1) * Math.cos(psi2) * Math.cos (lambda21)
	tmpi = Math.acos (cosi) * 180 / pi;
	item.set('search_i', Math.floor(tmpi*100 + 50)/ 100.0 );		// 2 sig digits

	// Set the items search i/e based on the current search click
	psi1 = item.get('spaceLat') / 180.0 * pi;
	psi2 = tLat / 180.0 * pi;
	lambda21 = (item.get('spaceLon') - tLon ) / 180.0 * pi;
	cose = Math.sin(psi1) * Math.sin(psi2) + Math.cos(psi1) * Math.cos(psi2) * Math.cos (lambda21)
	tmpe = Math.acos (cose) * 180 / pi;
	item.set('search_e', Math.floor (tmpe*100+50)/ 100.0 );		// 2 sig digits

	// If there is no footprint, then skip
	if (item.get('Footprint') == "") return;

	Db1.obsCont.pushObject (item); 
},//addtome

//---------------------------------
nameE: function () {
	nameSearch = g_rootV.controlV.nameT.value;
	if (! nameSearch) {
		return;
	}//if

	obs.set ('length', 0) 
	Db1.obsCont.set ('length', 0) 
	count = 0;

	fullList.forEach ( function (item) {
		name = item.get('file_name');
		if (name)
			if (name.indexOf(nameSearch) != -1)
				Db1.obsCont.addToMe (item); 
	});//foreach
	Db1.obsCont.set ('countT', Db1.obsCont.content.length + "/" + fullList.length());

},//nameE

//---------------------------------
gridE: function () {
	g_baseV.drawStuff();
},//gride

//---------------------------------
subSolarE: function () {
	g_baseV.drawStuff();
},//quad

//---------------------------------
quadE: function () {
	g_baseV.drawStuff();
},//quad

//---------------------------------
featuresE: function () {
	g_baseV.drawStuff();
},//quad

//---------------------------------
obsTitleE: function () {
	g_baseV.drawStuff();
},//obstitle

//---------------------------------
//		Does the double click on the sequence list
seqSelectedE: function () {
	current = g_rootV.controlV.obsList.contentView.selection;
	what = g_rootV.controlV.obsList.contentView.content;
	what.forEach (function (item) {
		item.set('useMe', false);
	});
	current.firstObject().set('useMe', true);
},//seq

//---------------------------------
// Sets flag for all and preloads a string filter for easy testing
shouldSequenceFilter: function () {
	what = g_rootV.controlV.obsList.contentView;
	allF = what.content.firstObject();
	g_filterA = [];

	if (! allF) return;

	if (allF.get('useMe') == true) return false;		// don't use a filter - use everything

	what.content.forEach (function (item) {
		if (item.get('useMe')) g_filterA.push (item.get('base'));
	});

	return g_filterA;
},//seq

//---------------------------------
//		This does all 3 tests
testFilter: function (item) {
	useme = YES;

	// Test sequence
	index = 1;

	if (seqFilter) {
		seqStr = item.get('MissionPhase') + " " + item.get('Thumb');
		index = g_filterA.indexOf(seqStr);
		if (index == -1) {      // not all and not in list
			seqStr = item.get('MissionPhase');
			index = g_filterA.indexOf(seqStr);
		}//if
	}//if
	if (index == -1) return NO;		// not all and not in list

	// Test resoltuion
	l_res = Db1.obsCont.get('Resolution');
	if (l_res) {
		i_res = parseFloat (item.get('MinRes'));
      if (parseFloat(l_res) < i_res) return NO;
	}//if

	// Test instrument
	l_inst = Db1.obsCont.get('instrument');
	if (l_inst == "All") return YES;

	i_inst = item.get('instrument');
	if (l_inst == i_inst) return YES;

	if (l_inst == "VIR All") {			// this overrides
		if (i_inst == "VIR-VIS") return YES;
		if (i_inst == "VIR-IR") return YES;
    }//ifuseme

	if (l_inst == "FC All") {			// this overrides
		if (i_inst == "FC1") return YES;
		if (i_inst == "FC2") return YES;
    }//ifuseme
	return NO;
},//

//---------------------------------
pnpoly: function (npol, xp, yp, x, y) {
  var i, j, c = 0;
  for (i = 0, j = npol-1; i < npol; j = i++) {

    if (( ((yp[i]<=y) && (y<yp[j])) ||
         ((yp[j]<=y) && (y<yp[i])) ) &&
        (x < (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i]))
      c = !c;
  }//for
  return c;
},

//---------------------------------
intersectRect: function (r1, r2) {
  return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.bottom > r1.top ||
           r2.top < r1.bottom);
}, //intersect


//---------------------------------
// This does a coordinate search
//		First, it will always test the filter
//		Second, it does the gross search (min/max Lat/Lon). 
//		Third, (if valid), it does polygon test
executeE: function () {
	seqFilter = Db1.obsCont.shouldSequenceFilter ();
	// Remove old
	obs.set ('length', 0) 
	Db1.obsCont.set ('length', 0) 
	Db1.obsCont.set('selection',null);
	coordSystem = Db1.mapC.get('g_coord');

	// Do the box
	if (Db1.mapC.moveX != 0) {
		lon = parseFloat(Db1.obsCont.longtitude);
		if (coordSystem == "West360") lon = 360 - lon;
		lat = parseFloat(Db1.obsCont.latitude);
		moveLon = parseFloat(Db1.mapC.moveLon);
		moveLat = parseFloat(Db1.mapC.moveLat);
		r1 = {};
		r2 = {};
		r1less = {};
		r1more = {};

		if (lon < moveLon) {
			r1.left = lon;
			r1.right = moveLon;
		} else {
			r1.left = moveLon;
			r1.right = lon;
		}//iflon

		if (lat < moveLat) {
			r1.bottom = lat;
			r1.top = moveLat;
		} else {
			r1.bottom = moveLat;
			r1.top = lat;
		}//iflat
		r1less.top = r1.top;
		r1less.bottom = r1.bottom;
		r1less.left = r1.left - 360;
		r1less.right = r1.right - 360;
		r1more.top = r1.top;
		r1more.bottom = r1.bottom;
		r1more.left = r1.left + 360;
		r1more.right = r1.right + 360;

		fullList.forEach ( function (item) {
			useme = Db1.obsCont.testFilter (item);
			if (useme) {
				r2.left = parseFloat (item.get('MinLon'));
				r2.right = parseFloat (item.get('MaxLon'));
				if (r2.left < 0) {
					r2.left +=360;
					r2.right +=360;
				}//if
				r2.top = parseFloat (item.get('MaxLat'));
				r2.bottom = parseFloat (item.get('MinLat'));
				try2 = 0;
				try3 = 0;

				within = Db1.obsCont.intersectRect (r1, r2);
				if (within) Db1.obsCont.addToMe (item); 
				else try2 = Db1.obsCont.intersectRect (r1less, r2);

				if (try2) Db1.obsCont.addToMe (item); 
				else try3 = Db1.obsCont.intersectRect (r1more, r2);
				
				if (try3) Db1.obsCont.addToMe (item); 

			}//ifuseme
		})
		g_baseV.drawStuff();
		Db1.obsCont.set ('countT', Db1.obsCont.content.length + "/" + fullList.length());
		return;
	}//ifmoveX

	lon = parseFloat(Db1.obsCont.longtitude);
	if (coordSystem == "West360") lon = 360 - lon;
	lat = parseFloat(Db1.obsCont.latitude);


	// Search on a point
	fullList.forEach ( function (item) {
		useme = Db1.obsCont.testFilter (item);
		//if (seqFilter) useme = Db1.obsCont.testFilter (item);

		// Evaluate Latitude
    	min = item.get('MinLat');
    	max = item.get('MaxLat');
    	if (min > lat) useme = NO;
    	if (max < lat) useme = NO;

		// Evaluate Longitude
    	min = item.get('MinLon');
    	max = item.get('MaxLon');
		// Deals with the clicked point is 
		//very high (needed because min is negative)
		holdLon = lon;
		if ((min < 0) && (lon > max)) {
			holdLon -= 360;
		}//if min
    	if (min > holdLon) useme = NO;
    	if (max < holdLon) useme = NO;

		// Add if valid
		footA = [];
		if (useme)  {
			footStr = item.get('Footprint');
			if (footStr) footA = footStr.split (", ");
			else console.log ("Sending nothing: ", item.toString());
			polyX = [];
			polyY = [];
			count = 0;
			// build array of polygon points.  If a point is invalid, overwrite 
			footA.forEach (function (item) {
				coordA = item.split (" ");
				polyX[count] = parseFloat(coordA[0]);
				polyY[count] = parseFloat(coordA[1]);
				good = true;
				if (polyX[count] == 1000) good = false;
				if (polyX[count] == "") good = false;
				if ( isNaN (polyX[count])) good = false;
				if (good) count++;
			})//foreach
			item.polyX = polyX;
			item.polyY = polyY;

			// Test if you are in (or close) to the polygone
			ans = 0;
			ans += Db1.obsCont.pnpoly(count, polyX, polyY, lon+2, lat+2);
			ans += Db1.obsCont.pnpoly(count, polyX, polyY, lon-2, lat+2);
			ans += Db1.obsCont.pnpoly(count, polyX, polyY, lon-2, lat-2);
			ans += Db1.obsCont.pnpoly(count, polyX, polyY, lon+2, lat-2);
			item.inPoly = ans;

			if (ans) Db1.obsCont.addToMe (item); 
    	}//if
  	});

	//Db1.obsCont.selectObject (theFirst, NO);
	g_baseV.drawStuff();
	Db1.obsCont.set ('countT', Db1.obsCont.content.length + "/" + fullList.length());

},//


//---------------------------------
openImgE: function () {
	window.open(this.imgPath);
},//

//---------------------------------
openInfoE: function () {
	window.open(this.infoPath);
},//

//---------------------------------
aboutE: function () {
	window.open(g_subpath + g_pathStr + "/about.html");
},//

//---------------------------------
showAllE: function (target) {
	//Db1.obsCont.set ('isEnabled', NO);

	obs.set ('length', 0) 
	Db1.obsCont.set ('length', 0) 

	seqFilter = Db1.obsCont.shouldSequenceFilter ();

	fullList.forEach ( function (item) {
		useme = Db1.obsCont.testFilter (item);
		if (useme) Db1.obsCont.addToMe (item); 
  });
	Db1.obsCont.set ('countT', Db1.obsCont.content.length + "/" + fullList.length());
},//showalle

//---------------------------------
selectAllE: function (target) {
  Db1.obsCont.selectObjects (Db1.obsCont, NO);
  g_baseV.drawStuff();
},

//---------------------------------
selectNoneE: function (target) {
  Db1.obsCont.selectObjects (null, NO);
  g_baseV.drawStuff();
},

//---------------------------------
cameraE: function (target) {
  title = target.title;
  console.log ("title: " + title);
  Db1.obsCont.set ('camera', title);
},

//---------------------------------
// I don't think this runs ever
instrumentA: function (target) {
    console.log (target);
    console.log (target.title());
    Db1.obsCont.set ('instrument', target.title());
},


//---------------------------------
instrumentE: function(view) {
console.log ("going");
  var pane = SC.MenuPane.create({
               items: [ 
     { title: 'All', target: 'Db1.obsCont', action:'instrumentA' },
     { title: 'PolyCam', target: 'Db1.obsCont', action:'instrumentA' },
     { title: 'MapCam', target: 'Db1.obsCont', action:'instrumentA' },
     { title: 'NavCam', target: 'Db1.obsCont', action:'instrumentA' },
     { title: 'NFTCam', target: 'Db1.obsCont', action:'instrumentA' },
                ],
               itemTitleKey: "title",
               itemActionKey: 'action',
               preferType: SC.PICKER_MENU,
               layout: { width: 150 }
             }) ;
    pane.popup(view) ;
},



}) ;
