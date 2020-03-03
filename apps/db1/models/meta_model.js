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
Db1.Meta = SC.Record.extend(
/** @scope Db1.Sequence.prototype */ {

	version: SC.Record.attr(String),
	date: SC.Record.attr(String),
	FC: SC.Record.attr(String),
	VIR: SC.Record.attr(String),

}) ;
