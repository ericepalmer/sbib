// ==========================================================================
// Project:   Db1.list
// Copyright: @2016 My Company, Inc.
// ==========================================================================
/*globals Db1 */

/** @class

  (Document Your Controller Here)

  @extends SC.ObjectController
*/
Db1.list = SC.ObjectController.create(
/** @scope Db1.list.prototype */ {

listStr: "No images selected",
source1A: "N/A",
source1B: "N/A",
source2A: "N/A",
source2B: "N/A",
jpg: "N/A",
tif: "N/A",
png: "N/A",
isis: "N/A",
extra: "N/A",
source1Suffix: ".tar.gz",
source2Suffix: ".tar.gz",


textA: function () {
   this.set ('listStr', 'Name, Res, MsnPhase, SeqID, Exp, i, e, phase, filter\n');
	list = Db1.obsCont.selection()
	if (! list) 
		list = Db1.obsCont

   list.forEach ( function (item) {
      name = item.get('file_name') + ', ';
      rez = item.get('MinRes') + ', ';
      msn = item.get('MissionPhase') + ', ';
      seq = item.get('Thumb') + ', ';
      exp = item.get('Exposure') + ', ';
      i = item.get('i') + ', ';
      e = item.get('e') + ', ';
      phase = item.get('phase') + ', ';
      filter = item.get('Filter') ;
		base = name + rez + msn + seq + exp + i + e + phase + filter + ' \n';
		Db1.list.set ('listStr', Db1.list.listStr + base);
   });//foreach
	maxLen = this.listStr.length + 10;

},//texta

//------------------------------------
execute : function () {

	this.textA();			// Gets the table view of the text

   pane = SC.SheetPane.create({
      layout: { left: 10, right:10, height: 500, centerY: 0 },
      contentView: SC.View.design({

         childViews: 'textB resultsT doneB s1A s1B s2A s2B fitsB tifB jpgB isisB pngB extraB projB lineB'.w(),

    		resultsT: SC.TextFieldView.design({
            layout: {left:2, right:2, top:2, bottom:60},
				valueBinding: "Db1.list.listStr",
      		backgroundColor: "lightGrey",
   			isEditable: false,
				isTextArea: true,
				//maxLength: maxLen,
				maxLength: 4148576,
    		}),

      doneB: SC.ButtonView.extend({
         layout: { width: 80, bottom: 30, height: 24, left: 10 },
         title: "Done",
         action: "hidePane",
         target: "Db1.list",
         isDefault: true,
      }),//doneB

      textB: SC.ButtonView.extend({
         layout: { width: 80, bottom: 5, height: 24, left: 10 },
         title: "Info",
         action: "textA",
         target: "Db1.list",
      }),//button


      s1A: SC.ButtonView.extend({
         layout: { width: 80, bottom: 5, height: 24, left: 120 },
         titleBinding: "Db1.list.source1A",
         action: "s1aA",
         target: "Db1.list",
      }),//button
		s1B: SC.ButtonView.extend({
			layout: { width: 80, bottom: 5, height: 24, left: 200 },
			titleBinding: "Db1.list.source1B",
			action: "s1bA",
			target: "Db1.list",
		}),//button
      s2A: SC.ButtonView.extend({
         layout: { width: 80, bottom: 30, height: 24, left: 120 },
         titleBinding: "Db1.list.source2A",
         action: "s2aA",
         target: "Db1.list",
      }),//button
      s2B: SC.ButtonView.extend({
         layout: { width: 80, bottom: 30, height: 24, left: 200 },
         titleBinding: "Db1.list.source2B",
         action: "s2bA",
         target: "Db1.list",
      }),//button


		// Projected checkbox button
      projB: SC.CheckboxView.design({
         layout: { width: 200, bottom: 30, height: 24, left: 420 },
         title: "Projected",
         target: "Db1.list",
         action: "projA"
      }),//button
      lineB: SC.View.design({
         layout: { width: 320, bottom: 34, height: 3, left: 300 },
			backgroundColor: "black",
      }),//button


		// Normal buttons
      jpgB: SC.ButtonView.extend({
         layout: { width: 80, bottom: 5, height: 24, left: 300 },
         titleBinding: "Db1.list.jpg",
         action: "jpgA",
         target: "Db1.list",
      }),//button

      pngB: SC.ButtonView.extend({
         layout: { width: 80, bottom: 5, height: 24, left: 380 },
         titleBinding: "Db1.list.png",
         action: "pngA",
         target: "Db1.list",
      }),//button
      tifB: SC.ButtonView.extend({
         layout: { width: 80, bottom: 5, height: 24, left: 460 },
         titleBinding: "Db1.list.tif",
         action: "tifA",
         target: "Db1.list",
      }),//button
      isisB: SC.ButtonView.extend({
         layout: { width: 80, bottom: 5, height: 24, left: 540 },
         titleBinding: "Db1.list.isis",
         action: "isisA",
         target: "Db1.list",
      }),//button

      extraB: SC.ButtonView.extend({
         layout: { width: 80, bottom: 5, height: 24, left: 650 },
         titleBinding: "Db1.list.extra",
         action: "extraA",
         target: "Db1.list",
      }),//button

      })//contentV
   });//pane


   s1aVal = systemA.firstObject().get('s1a')
   s1bVal = systemA.firstObject().get('s1b')
   s2aVal = systemA.firstObject().get('s2a')
   s2bVal = systemA.firstObject().get('s2b')

   pngVal = systemA.firstObject().get('png')
   jpgVal = systemA.firstObject().get('jpg')
   isisVal = systemA.firstObject().get('isis')
   tifVal = systemA.firstObject().get('tif')

   extraVal = systemA.firstObject().get('extra')

	// If the json string has source*Suffix defined, then overwrite the default
   val = systemA.firstObject().get('source1Suffix')
	if (val) this.set ('source1Suffix', val);
   val = systemA.firstObject().get('source2Suffix')
	if (val) this.set ('source2Suffix', val);

	// Show/hide the buttons and set the string values
	if (! s1aVal) pane.contentView.s1A.set('isVisible', false)
	else this.set ('source1A', s1aVal)
	if (! s1bVal) pane.contentView.s1B.set('isVisible', false)
	else this.set ('source1B', s1bVal)
	if (! s2aVal) pane.contentView.s2A.set('isVisible', false)
	else this.set ('source2A', s2aVal)
	if (! s2bVal) pane.contentView.s2B.set('isVisible', false)
	else this.set ('source2B', s2bVal)

	if (! jpgVal) pane.contentView.jpgB.set('isVisible', false)
	else this.set ('jpg', jpgVal)
	if (! pngVal) pane.contentView.pngB.set('isVisible', false)
	else this.set ('png', pngVal)
	if (! isisVal) pane.contentView.isisB.set('isVisible', false)
	else this.set ('isis', isisVal)
	if (! tifVal) pane.contentView.tifB.set('isVisible', false)
	else this.set ('tif', tifVal)

	if (! extraVal) pane.contentView.extraB.set('isVisible', false)
	else this.set ('extra', extraVal)


	// not sure if I need all of these
	pane.set('layerNeedsUpdate', YES)
	pane.contentView.set('layerNeedsUpdate', YES)
	//pane.contentView.tifB.set('layerNeedsUpdate', YES)
	Db1.list.set('layerNeedsUpdate', YES)

   pane.append()
   this.set('pane', pane)

},//


/////////////////////////////////////
// buildDown
/////////////////////////////////////
buildDown: function (lPath, suffix) {
	running = '# Copy/paste this into a unix window to download the selected files\n';

	list = Db1.obsCont.selection()
	if (! list) 
		list = Db1.obsCont

   list.forEach ( function (item) {
      name = item.get('file_name') 
      rawName = item.get('filenameA') 
      phase = item.get('MissionPhase') 
      seq = item.get('Thumb') 
      inst = item.get('instrument') 
      filter = item.get('Filter') 

		core = "curl -O https://sbib.psi.edu" + g_subpath + g_pathStr + "/" + phase + "/" + seq + "-" + inst + "/" + lPath

/*
		// deal with Dawn as broken stupid stuff
		if (src && g_target == "Vesta") {
			console.log ("new path stuff");
			core = "curl -O https://sbib.psi.edu" + g_subpath + g_pathStr + "/" + phase + "/" + lPath
		}//if src
*/
		



		// different filename if we are using level 1A (raw)
		if (raw)
			running = running + core + rawName + suffix + "\n"
		else
			running = running + core + name + suffix + "\n"

   });//foreach
	Db1.list.set ('listStr', running);
	maxLen = this.listStr.length + 10;

	//var holdPane = pane

},//builddown



//------------------------------------
s1aA: function() {
	console.log ("s1a")
	raw=true
	src=true
	this.buildDown ("frame/" + s1aVal + "/", this.source1Suffix)
},//
//------------------------------------
s1bA: function() {
	console.log ("s1b")
	raw=false
	src=true
	this.buildDown ("frame/" + s1bVal + "/", this.source1Suffix)
},//
//------------------------------------
s2aA: function() {
	console.log ("s2a")
	raw=true
	src=true
	this.buildDown ("frame/" + s2aVal + "/", this.source2Suffix)
},//
//------------------------------------
s2bA: function() {
	console.log ("s2b")
	raw=false
	src=true
	this.buildDown ("frame/" + s2bVal + "/", this.source2Suffix)
},//



//------------------------------------
jpgA: function() {
	console.log ("jpgA")
	raw=false
	src=false
	// Set if if the images should be projected
   projVal = pane.contentView.projB.value
	if (projVal)
		projectionPath = "/maps/"
	else
		projectionPath = "/frame/"

	this.buildDown (projectionPath + "/" + jpgVal + "/", ".jpg")
},//
//------------------------------------
pngA: function() {
	console.log ("png")
	raw=false
	src=false
	// Set if if the images should be projected
   projVal = pane.contentView.projB.value
	if (projVal)
		projectionPath = "/maps/"
	else
		projectionPath = "/frame/"

	this.buildDown (projectionPath + "/" + pngVal + "/", ".png")
},//
//------------------------------------
tifA: function() {
	console.log ("tifA")
	raw=false
	src=false
	// Set if if the images should be projected
   projVal = pane.contentView.projB.value
	if (projVal)
		projectionPath = "/maps/"
	else
		projectionPath = "/frame/"

	this.buildDown (projectionPath + "/" + tifVal + "/", ".tif")
},//
//------------------------------------
isisA: function() {
	console.log ("isisA")
	raw=false
	src=false
	// Set if if the images should be projected
   projVal = pane.contentView.projB.value
	if (projVal)
		projectionPath = "/maps/"
	else
		projectionPath = "/frame/"

	if (projVal)
		this.buildDown (projectionPath + "/" + "cubes/m-", ".cub.gz")
	else
		this.buildDown (projectionPath + "/" + "cubes/f-", ".cub.gz")
},//



//------------------------------------
extraA: function() {
	console.log ("extraA")
	raw=false
	src=false
	this.buildDown ("frame/" + extraVal + "/", ".tar.gz")
},//

//------------------------------------
hidePane: function() {

   pane.remove();
//   this.set('phase', "Move");
},//hidepane



});
