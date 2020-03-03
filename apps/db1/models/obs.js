// ==========================================================================
// Project:   Db1.Obs
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Db1 */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Db1.Obs = SC.Record.extend(
/** @scope Db1.Obs.prototype */ {

  // TODO: Add your own code here.

  ImageName: SC.Record.attr(String),
  Thumb: SC.Record.attr(String),
  Time: SC.Record.attr(Date),
  central_body: SC.Record.attr(String),
  target_desc: SC.Record.attr(String),
  target_name: SC.Record.attr(String),
  ObsType: SC.Record.attr(String),
  MissionPhase: SC.Record.attr(String),
  SequenceID: SC.Record.attr(String),
  Sequencetype: SC.Record.attr(String),
  instrument: SC.Record.attr(String),
  Filter: SC.Record.attr(String),
  Exposure: SC.Record.attr(Number),
  Arguments: SC.Record.attr(String),
  Quality: SC.Record.attr(Number),
  Limb: SC.Record.attr(Number),
  Pole: SC.Record.attr(String),
  iSpice: SC.Record.attr(String),
  tSpice: SC.Record.attr(String),
  shape: SC.Record.attr(String),
  Processed: SC.Record.attr(Date),

  Footprint: SC.Record.attr(String),
  MinLat: SC.Record.attr(Number),
  MaxLat: SC.Record.attr(Number),
  MinLon: SC.Record.attr(Number),
  MaxLon: SC.Record.attr(Number),
  Distance: SC.Record.attr(Number),
  Phase: SC.Record.attr(Number),
  MinRes: SC.Record.attr(Number),
  MaxRes: SC.Record.attr(Number),
  samples: SC.Record.attr(Number),
  lines: SC.Record.attr(Number),
  Projected: SC.Record.attr(String),
  Map: SC.Record.attr(String),
  Filter: SC.Record.attr(String),
  Level: SC.Record.attr(String),
  Shape: SC.Record.attr(String),
  filename: SC.Record.attr(String),
  filenameA: SC.Record.attr(String),

  sunLat: SC.Record.attr(String),
  sunLon: SC.Record.attr(String),
  spaceLat: SC.Record.attr(String),
  spaceLon: SC.Record.attr(String),
  Lat: SC.Record.attr(String),
  Lon: SC.Record.attr(String),

}) ;
