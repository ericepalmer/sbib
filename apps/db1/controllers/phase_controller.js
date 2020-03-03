// ==========================================================================
// Project:   Db1.inst
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Db1 */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Db1.phaseC = SC.Controller.create(
/** @scope Db1.inst.prototype */ {

menu : SC.MenuPane.create({
	items : [
  	{ title: 'All'},
  	{ title: 'Approach'},
  	{ title: 'Survey'},
  	{ title: 'HAMO', selected:YES},
  	{ title: '-LAMO'},
  	{ title: '-HAMO2'},
  	{ title: '-Departure'},
	],
	layout: { left: 0, width:130 },
}),

}) ;
