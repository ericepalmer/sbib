// ==========================================================================
// Project:   Db1.Sequence
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Db1 */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Db1.Place = SC.Record.extend(
/** @scope Db1.Sequence.prototype */ {

	guid: SC.Record.attr(String),
	name: SC.Record.attr(String),
	CenterLat: SC.Record.attr(Number),
	CenterLon: SC.Record.attr(Number),

}) ;
