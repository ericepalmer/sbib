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
Db1.System = SC.Record.extend(
/** @scope Db1.Sequence.prototype */ {

	target: SC.Record.attr(String),
	org: SC.Record.attr(String),
	jpg: SC.Record.attr(String),
	png: SC.Record.attr(String),
	tif: SC.Record.attr(String),
	isis: SC.Record.attr(String),
	s1a: SC.Record.attr(String),
	s1b: SC.Record.attr(String),
	s2a: SC.Record.attr(String),
	s2b: SC.Record.attr(String),
	extra: SC.Record.attr(String)
}) ;
