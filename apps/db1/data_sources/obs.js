// ==========================================================================
// Project:   Db1.ObsDataSource
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Db1 */

/** @class
  (Document Your Data Source Here)
  @extends SC.DataSource
*/


//g_pathStr = "Open-Iapetus"        // Original path
//g_pathStr = "Dawn-Ceres";        // Original path
//g_pathStr = "Dawn-Vesta"        // Original path
//g_pathStr = "ORex-Bennu"        // Original path
g_pathStr = "PDS-Eros"        // Original path - 169 and 220
g_pathStr = "PDS-Ceres"        // Original path - 173, 223
g_pathStr = "PDS-Pluto"        // Original path - 170, 225
g_pathStr = "PDS-Vesta"        // Original path - 167, 226
g_pathStr = "PDS-Bennu"        // Original path - 162, 227

sc_require('models/obs');

Db1.SYSTEM_QUERY = SC.Query.remote(Db1.System, { orderBy: 'guid' });
Db1.OBS_QUERY = SC.Query.remote(Db1.Obs);
Db1.SEQ_QUERY = SC.Query.remote(Db1.Sequence, { orderBy: 'guid' });
Db1.META_QUERY = SC.Query.remote(Db1.Meta, { orderBy: 'guid' });
Db1.PLACE_QUERY = SC.Query.remote(Db1.Place, { orderBy: 'guid' });
 
Db1.ObsDataSource = SC.DataSource.extend(
/** @scope Db1.ObsDataSource.prototype */ {

  // ..........................................................
  // QUERY SUPPORT
  // 

fetch: function(store, query) {
	//subpath = "/Dawn/";
	//subpath = "/";
	subpath = "/data/";
	if (! Db1.mapC) return;
	pathStr = Db1.mapC.get  ('g_pathStr');
	console.log (".. fetch: ", g_pathStr);
 
  if (query === Db1.OBS_QUERY) {
	//reqStr = "/data/" + g_pathStr + "/" + g_pathStr + "-images.json";
	reqStr = subpath + g_pathStr + "/" + g_pathStr + "-images.json";
	console.log ("reqStr", reqStr);
   SC.Request.getUrl(reqStr).header({'Accept': 'application/json'}).json()
     .notify(this, 'didFetchObs', store, query)
     .send();
   return YES;
	}//if
 
  if (query === Db1.SEQ_QUERY) {
	reqStr = subpath + g_pathStr + "/" + g_pathStr + "-sequences.json";
	console.log ("seq request str", reqStr);
    SC.Request.getUrl(reqStr).header({'Accept': 'application/json'}).json()
      .notify(this, 'didFetchSeq', store, query)
      .send();
    return YES;
  }//if

  if (query === Db1.META_QUERY) {
	reqStr = subpath + g_pathStr + "/" + g_pathStr + "-meta.json";
	console.log ("meta str: ", reqStr);
    SC.Request.getUrl(reqStr).header({'Accept': 'application/json'}).json()
      .notify(this, 'didFetchMeta', store, query)
      .send();
    return YES;
  }//if

  if (query === Db1.PLACE_QUERY) {
	reqStr = subpath + g_pathStr + "/" + g_pathStr + "-places.json";
	console.log ("places str: ", reqStr);
    SC.Request.getUrl(reqStr).header({'Accept': 'application/json'}).json()
      .notify(this, 'didFetchPlace', store, query)
      .send();
    return YES;
  }//if

  if (query === Db1.SYSTEM_QUERY) {
	reqStr = subpath + g_pathStr + "/system.json";
	console.log ("system str: ", reqStr);
    SC.Request.getUrl(reqStr).header({'Accept': 'application/json'}).json()
      .notify(this, 'didFetchSystem', store, query)
      .send();
    return YES;
  }//if

	console.log ("blat");
  return NO;
},


 
//---------------------------------------------
didFetchObs: function(response, store, query) {
	
	console.log (".. didFetchObs");
	if (SC.ok(response)) {
 
		 //Version 2, remove query
      var storeKeys = store.loadRecords(Db1.Sequence, response.get('body').content);
      store.loadQueryResults(query, storeKeys);

		// Version 1, local query
		//store.loadRecords(Db1.Obs, response.get('body').content);
		//store.dataSourceDidFetchQuery(query);

		// Count the number of images and set them
		// FIXME - need to put in the counting algorithm
		what = g_rootV.controlV.obsList.contentView.content;
		what.forEach (function (item) {
			base = item.get('name');
			item.set('base', base );
			//item.set('name', base + " (" + "66" + ")");
		});

	} else store.dataSourceDidErrorQuery(query, response);

	Db1.mainPage.mainPane.scrollV.contentView.controlV.set ('isVisible', true);
	//Db1.mainPage.mainPane.scrollV.contentView.controlV.exB.set ('title', "Search");
	
},
 
//---------------------------------------------
didFetchSeq: function(response, store, query) {
	console.log (".. didFetchSeq");

	if (SC.ok(response)) {
      var storeKeys = store.loadRecords(Db1.Sequence, response.get('body').content);
      store.loadQueryResults(query, storeKeys);

		what = g_rootV.controlV.obsList.contentView.content;
		what.forEach (function (item) {
			item.set('useMe', false);
		});
		item = what.objectAt(1);
		item.set('useMe', true);

	} else store.dataSourceDidErrorQuery(query, response);
},

//---------------------------------------------
//---------------------------------------------
didFetchMeta: function(response, store, query) {
	
	console.log (".. didFetchMeta");

	if (SC.ok(response)) {
      var storeKeys = store.loadRecords(Db1.Meta, response.get('body').content);
      store.loadQueryResults(query, storeKeys);

		g_meta = metaA.firstObject();
		Db1.obsCont.set ('currentT', "<BR>Current as of:  " + g_meta.get('date') 
					+ '<BR><BR>' + g_meta.get('fc')
					+ '<BR>' + g_meta.get('vir')
					+ '<BR>' + g_meta.get('stat')
					+ '<BR>' + g_meta.get('note')
					+ '<BR>' + g_meta.get('comment')
					);

	} else store.dataSourceDidErrorQuery(query, response);
},
 
//---------------------------------------------
didFetchPlace: function(response, store, query) {
	
	console.log (".. didFetch Place");
	console.log (response.get('body'));

	if (SC.ok(response)) {
      var storeKeys = store.loadRecords(Db1.Place, response.get('body').content);
      store.loadQueryResults(query, storeKeys);
		//console.log ("place: " + featureA.length() );

	} else store.dataSourceDidErrorQuery(query, response);
	console.log (".. doneFetchPlace");
},

//---------------------------------------------
didFetchSystem: function(response, store, query) {
	
	console.log (".. didFetch System");

	if (SC.ok(response)) {
      var storeKeys = store.loadRecords(Db1.System, response.get('body').content);
      store.loadQueryResults(query, storeKeys);

		// Read the target from system-json file and set target-specific values
		g_target = systemA.firstObject().get('target');
		g_organization = systemA.firstObject().get('org');
		console.log ("Target", g_target, g_organization);

		Db1.mapC.set ('g_coord', "East360");      // Ceres is East360

		Db1.mainPage.mainPane.scrollV.contentView.controlV.instMEros.set ('isVisible', false)
		Db1.mainPage.mainPane.scrollV.contentView.controlV.instMDawn.set ('isVisible', false)
		Db1.mainPage.mainPane.scrollV.contentView.controlV.instMNewF.set ('isVisible', false)
		Db1.mainPage.mainPane.scrollV.contentView.controlV.instM.set ('isVisible', false)
		switch (g_target) {
   		case "Iapetus":
      		var mapStr = "Iapetus";
				console.log ("Setting Iapetus");
   		break;
   		case "Vesta":
      		var mapStr = "Equator-Topo";
      		g_subpath = "/data/";
				Db1.mainPage.mainPane.scrollV.contentView.controlV.instMDawn.set ('isVisible', true)
				Db1.mapC.set ('menu',  Db1.mapC.menuVesta)
				Db1.mapC.set ('menuBinding', Db1.mapC.menuVesta);
				Db1.mapC.set ('mapStart', '180');
				Db1.mapC.set ('g_coord', "Vesta-IAU");

				console.log ("Setting Vesta");
   		break;
   		case "Ceres":
      		var mapStr = "Equator-Topo";
				Db1.mapC.set ('g_coord', "East360");      // Ceres is East360
      		g_subpath = "/data/";
				Db1.mainPage.mainPane.scrollV.contentView.controlV.instMDawn.set ('isVisible', true)
				Db1.mapC.set ('menu',  Db1.mapC.menuCeres)
				Db1.mapC.set ('menuBinding', Db1.mapC.menuCeres);
				console.log ("Setting Ceres");
   		break;
   		case "Eros":
      		var mapStr = "Equator-Topo";
      		g_subpath = "/";
				Db1.mainPage.mainPane.scrollV.contentView.controlV.instMEros.set ('isVisible', true)
				Db1.mapC.set ('menu',  Db1.mapC.menuEros)
				Db1.mapC.set ('menuBinding', Db1.mapC.menuEros);
				console.log ("Setting Eros");
   		break;
   		case "Pluto":
      		var mapStr = "Eq-Image";
      		g_subpath = "/";
				Db1.mapC.set ('menu',  Db1.mapC.menuPluto)
				Db1.mainPage.mainPane.scrollV.contentView.controlV.instMNewF.set ('isVisible', true)
				console.log ("Setting Pluto");
   		break;
   		case "Bennu":
      		var mapStr = "Eq-Image";
      		g_subpath = "/";
				Db1.mapC.set ('menu',  Db1.mapC.menuBennu)
				Db1.mainPage.mainPane.scrollV.contentView.controlV.instMNewF.set ('isVisible', true)
				console.log ("Setting Bennu");
   		break;
   		default:
      		console.log ("#### g_target");
   		break;
		}//switch

		Db1.mapC.set ('mapName',  mapStr)
		Db1.mapC.set ('layerNeedsUpdate', YES);

				//Db1.mapC.set ('menuBinding', Db1.mapC.menuPluto);


		// I wish I could make this work, but was unable to -- went with 4 menus
		//Db1.mainPage.mainPane.scrollV.contentView.controlV.instM.set ("menuBinding", "Db1.eros.menu")
		

		// Set up paths to the data files (html file structure)
		var tmpPath= g_subpath + g_pathStr + "/ref_maps/" + mapStr + ".jpg"
		g_rootV.mapV.contentView.mainImgView.set ('value', tmpPath);
		tmpPath=g_subpath + g_pathStr + "/ref_maps/SplashScreen.png"
		
		Db1.mapC.set ('previewImg', tmpPath);
		Db1.mapC.set ('g_target', g_target);
		Db1.mapC.set ('g_organization', g_organization);
		Db1.mapC.set ('g_pathStr', g_pathStr);

		// Load the rest of the data files
		//FIXME - Can't get this to work
		//seqA = Db1.store.find(Db1.SEQ_QUERY);
		//Db1.sequenceCont.set('content', seqA);



	} else store.dataSourceDidErrorQuery(query, response);
	console.log (".. doneFetch System");
	console.log ("Path str" + g_pathStr);
},
 
/*
  fetch: function(store, query) {

    // TODO: Add handlers to fetch data for specific queries.  
    // call store.dataSourceDidFetchQuery(query) when done.

    return NO ; // return YES if you handled the query
  },
*/

  // ..........................................................
  // RECORD SUPPORT
  // 
  
//---------------------------------------------
retrieveRecord: function(store, storeKey) {
console.log (".. retrieveRecord");
  if (SC.kindOf(store.recordTypeFor(storeKey), Db1.Obs)) {
 
    var url = store.idFor(storeKey);
    SC.Request.getUrl(url).header({
                'Accept': 'application/json'
            }).json()
      .notify(this, 'didRetrieveObs', store, storeKey)
      .send();
    return YES;
 
  } else return NO;
},
 
//---------------------------------------------
didRetrieveObs: function(response, store, storeKey) {
console.log (".. didRetrieveRecord");
  if (SC.ok(response)) {
    var dataHash = response.get('body').content;
    store.dataSourceDidComplete(storeKey, dataHash);
 
  } else store.dataSourceDidError(storeKey, response);
}, 
 
/*
  retrieveRecord: function(store, storeKey) {
    
    // TODO: Add handlers to retrieve an individual record's contents
    // call store.dataSourceDidComplete(storeKey) when done.
    
    return NO ; // return YES if you handled the storeKey
  },
*/
  
  createRecord: function(store, storeKey) {
    
    // TODO: Add handlers to submit new records to the data source.
    // call store.dataSourceDidComplete(storeKey) when done.
    
    return NO ; // return YES if you handled the storeKey
  },
  
  updateRecord: function(store, storeKey) {
    
    // TODO: Add handlers to submit modified record to the data source
    // call store.dataSourceDidComplete(storeKey) when done.

    return NO ; // return YES if you handled the storeKey
  },
  
  destroyRecord: function(store, storeKey) {
    
    // TODO: Add handlers to destroy records on the data source.
    // call store.dataSourceDidDestroy(storeKey) when done
    
    return NO ; // return YES if you handled the storeKey
  }
  
}) ;
