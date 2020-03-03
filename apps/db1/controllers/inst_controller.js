// ==========================================================================
// Project:   Db1.inst
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Db1 */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Db1.inst = SC.Controller.create(
/** @scope Db1.inst.prototype */ {

menu : SC.MenuPane.create({
	items : [
  	{ title: 'All', isChecked: YES},
  	{ title: 'VIR All'},
  	{ title: 'VIR-IR'},
  	{ title: 'VIR-VIS'},
  	{ title: 'FC All'},
  	{ title: 'FC1'},
  	{ title: 'FC2'}
	],
	layout: { left: 0, width:100 },
}),

}) ;
