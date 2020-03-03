// ==========================================================================
// Project:   Db1
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Db1 */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
Db1.main = function main() {

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.  
  Db1.getPath('mainPage.mainPane').append() ;

  // Step 2. Set the content property on your primary controller.
  // This will make your app come alive!

/*
menuItems = [
  { title: 'Menu Item', keyEquivalent: 'ctrl_shift_n' },
  { title: 'Checked Menu Item', isChecked: YES, keyEquivalent: 'ctrl_a' },
  { title: 'Selected Menu Item', keyEquivalent: ['backspace', 'delete'] },
  { isSeparator: YES },
  { title: 'Menu Item with Icon', icon: 'inbox', keyEquivalent: 'ctrl_m' },
  { title: 'Menu Item with Icon', icon: 'folder', keyEquivalent: 'ctrl_p' }
];

instMenu = SC.MenuPane.create({
  items: menuItems
});
*/

g_rec = 0;
seqA = Db1.store.find(Db1.SEQ_QUERY);
metaA = Db1.store.find(Db1.META_QUERY);
systemA = Db1.store.find(Db1.SYSTEM_QUERY);
fullList = Db1.store.find(Db1.OBS_QUERY);
featureA = Db1.store.find(Db1.PLACE_QUERY);
theFirst = fullList.firstObject();		

obs = [];
Db1.obsCont.set('content', obs);

Db1.sequenceCont.set('content', seqA);

Db1.inst.menu.addObserver("selectedItem", function() {		// really a leftover
	inst = Db1.inst.menu.selectedItem.title;
	Db1.obsCont.set('instrument',  inst);
});

Db1.eros.menu.addObserver("selectedItem", function() {
	inst = Db1.eros.menu.selectedItem.title;
	Db1.obsCont.set('instrument',  inst);
});

Db1.newF.menu.addObserver("selectedItem", function() {
	inst = Db1.newF.menu.selectedItem.title;
	Db1.obsCont.set('instrument',  inst);
});

Db1.dawn.menu.addObserver("selectedItem", function() {
	inst = Db1.dawn.menu.selectedItem.title;
	Db1.obsCont.set('instrument',  inst);
});

Db1.phaseC.menu.addObserver("selectedItem", function() {
	phase = Db1.phaseC.menu.selectedItem.title;
	Db1.obsCont.set('selPhase',  phase);
});

/*
//g_organization = "Dawn";
//g_organization = "Open";
//g_organization = "ORex";
g_organization = "PDS";
g_organization = "going";

//g_target="Iapetus";
//g_target="Vesta";
//g_target="Bennu";
g_target="Ceres";
g_target="going";
//g_target="Eros";
*/



// Map start is what the latitude of the left most part of the image
// Some maps start with 0 at the far left (or 360 if running east360),
//		which puts 180 in the middle of the screen.
//		Other maps want 180 on the left, putting 0 in the middle of the screen

// This is for the Vesta PDS
//Db1.mapC.set ('mapStart', '180');
//Db1.mapC.set ('g_coord', "Vesta-IAU");
// This is for the Vesta Dawn Team
Db1.mapC.set ('mapStart', '0');

// There are three coordiante options, West360, East360, East180 (Earth and Moon)
//Db1.mapC.set ('g_coord', "Vesta-Dawn");
//Db1.mapC.set ('g_coord', "West360");
Db1.mapC.set ('g_coord', "East360");		// Ceres is East360

g_version = 1;
g_build = "47";
g_level = "a1";
Db1.obsCont.set ('version',  "ver:" + g_version + "." +  g_build + g_level);

} ;

function main() { Db1.main(); }



