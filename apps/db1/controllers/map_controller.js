// ==========================================================================
// Project:   Db1.inst
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Db1 */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Db1.mapC = SC.Controller.create(
/** @scope Db1.inst.prototype */ {

mapName: "Eq-Image",
mapObject:  { title: 'Equator-Topo', which:'Eq', width:'30'},
pole: false,
whichPole: 0,
zoom: false,
norm: true,
previewImg: "old",// old shouldn't work
mapStart: 180,		// see main.js
moveX: 0,
moveY: 0,

// for Dawn-Ceres Mission
menuCeres : SC.MenuPane.create({
	items : [
  	{ title: 'Eq-Topo', which:'Eq', width:'30'},
  	{ title: 'Eq-DLR', which:'Eq', width:'30'},
  	{ title: 'SPole-DLR1', which:'SPole', width:'30'},
  	{ title: 'NPole-DLR1', which:'NPole', width:'30'},
	],
	layout: { left: 0, width:140 },
}),



// for New Horizons - Pluto
menuPluto : SC.MenuPane.create({
	items : [
  	{ title: 'Eq-Image', which:'Eq', width:'30'},
//  	{ title: 'Eq-Topo', which:'Eq', width:'30'},
	],
	layout: { left: 0, width:140 },
}),

// for ORIRIS-REx - Bennu
menuBennu : SC.MenuPane.create({
	items : [
  	{ title: 'Eq-Image', which:'Eq', width:'30'},
  	{ title: 'Eq-Topo', which:'Eq', width:'30'},
	],
	layout: { left: 0, width:140 },
}),


// for Dawn-Vesta Mission
menuVesta : SC.MenuPane.create({
	items : [
  	{ title: 'Equator-Topo', which:'Eq', width:'360'},
  	{ title: 'Equator_DLR', which:'Eq', width:'360'},
//  	{ title: 'Equator-DLR', which:'Eq', width:'360'},
  	{ title: 'Equator-Geo', which:'Eq', width:'360'},   // dawn
  	{ title: 'Equator-Color', which:'Eq', width:'360'},
//  	{ title: 'Equator-H-Sep12', which:'Eq', width:'360'},
//  	{ title: 'Equator-bolo', which:'Eq', width:'360'},
  	{ title: '--------', which:'Eq', width:'360'},

  	{ title: 'SPole-Topo', which:'SPole', width:'30'},
//  	{ title: 'SPole-DLR', which:'SPole', width:'35.3'},   // dawn
  	{ title: 'SPole-Geo1', which:'SPole', width:'30'},
//  	{ title: 'SPole-Geo', which:'SPole', width:'30'},
//  	{ title: 'SPole-Color', which:'SPole', width:'35.3'},   // dawn
  	{ title: '--------', which:'Eq', width:'360'},

  	{ title: 'NPole-Topo', which:'NPole', width:'30'},
  	{ title: 'NPole-DLR1', which:'NPole', width:'30'},   // dawn
	],
	layout: { left: 0, width:140 },
}),





// -----------------
//  for PDS-Eros
menuEros : SC.MenuPane.create({
	items : [
  	{ title: 'Equator-Topo', which:'Eq', width:'360'},
  	{ title: 'Oct-1', which:'Eq', width:'180'},
	],
	layout: { left: 0, width:140 },
}),


//---------------------------------
changeMap: function () {
	g_rootV.mapV.contentView.mainImgView.set ('layerNeedsUpdate', YES);

	newMapO = Db1.mapC.menu.selectedItem;
	if (newMapO.title == '--------') return;

	this.set('mapObject', newMapO);
	this.set('mapName', newMapO.title);
	path = g_subpath + g_pathStr + "/ref_maps/" + newMapO.title + ".jpg";
	//path = g_subpath + g_pathStr + "/ref_maps/" + newMapO.title + ".png";

	// Special actions for the pole
	switch (newMapO.which) {
		case "SPole":
		case "NPole":
			Db1.mapC.pole = true;
			Db1.mapC.whichPole = newMapO.which;
			Db1.mapC.zoom = false;
			Db1.mapC.norm = false;
			g_rootV.mapV.contentView.mainImgView.set ('isVisible', false);
			g_rootV.mapV.contentView.poleImgView.set ('value', path);
			g_baseV.drawStuff();
			return;
			break;
	}//switch

	// Everything else
	Db1.mapC.pole = false;
	Db1.mapC.zoom = false;
	Db1.mapC.norm = true;
	g_rootV.mapV.contentView.mainImgView.set ('isVisible', true);
	g_rootV.mapV.contentView.mainImgView.set ('value', path);
	g_baseV.drawStuff();

}.observes('Db1.mapC.menu.selectedItem'),

//---------------------------------
changeFrame: function () {
	Db1.obsCont.click();
}.observes('Db1.obsCont.camera'),
//}.observes('Db1.mainPage.mainPane.scrollV.contentView.cameraB.value'),

}) ;
