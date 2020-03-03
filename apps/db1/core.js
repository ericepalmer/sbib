// ==========================================================================
// Project:   Db1
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Db1 */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
Db1 = SC.Application.create(
  /** @scope Db1.prototype */ {

  NAMESPACE: 'Db1',
  VERSION: '1.2',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  fStore: SC.Store.create().from(SC.Record.fixtures),

  store: SC.Store.create({ 
		orderBy: 'Exposure'
  }).from('Db1.ObsDataSource'),

  
  // TODO: Add global constants or singleton objects needed by your app here.

}) ;
