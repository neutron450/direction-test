 var currentBldgID;
 var isFloorSelectorEnabled = false;
 var floors = {};
 var currentFloorId;
 var MapLabels = {};


 var dropdownClicked = function() {
  if(isFloorSelectorEnabled)
  {

   ambiarc.exitBuilding();
 }else{

   ambiarc.viewFloorSelector(currentBldgID,0);
 }

};


//This method is called when the iframe loads, it subscribes onAmbiarcLoaded so we know when the map loads
var iframeLoaded = function() {
 $("#ambiarcIframe")[0].contentWindow.document.addEventListener('AmbiarcAppInitialized', function() {
   onAmbiarcLoaded();
 });

 var startLat;
 var startLon;
 var startFloor;
 var startBLG;

 var endLat;
 var endLon;
 var endFloor;
 var endBLG;


 $("#ambiarcIframe")[0].contentWindow.addEventListener("keypress", function(event) {
// s key
  if (event.keyCode == 115) {
   ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {
    startFloor = currentFloorId;
    startBLG = currentBldgID;
    startLat =  latlon.lat
    startLon  =latlon.lon
  });
 }
// e key
 if (event.keyCode == 101) {

  ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {
    endFloor = currentFloorId;
    endBLG = currentBldgID;
    endLat =  latlon.lat
    endLon  =latlon.lon;
  });

}
// d key
if (event.keyCode == 100) {
  ambiarc.getDirections(startBLG, startFloor, startLat, startLon, endBLG, endFloor, endLat, endLon, (directions) => {})
}

// c key
if (event.keyCode == 99) {
  ambiarc.clearDirections()
}

});

}

// once Ambiarc is loaded, we can use the ambiarc object to call SDK functions
var onAmbiarcLoaded = function() {
  ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

    // Subscribe to various events needed for this application
    ambiarc.registerForEvent(ambiarc.eventLabel.RightMouseDown, onRightMouseDown);
    ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelected, onFloorSelected);
    ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelectorEnabled, onEnteredFloorSelector);
    ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelectorDisabled, onExitedFloorSelector);
    ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelectorFloorFocusChanged, onFloorSelectorFocusChanged);
    ambiarc.registerForEvent(ambiarc.eventLabel.BuildingExitCompleted, BuildingExitCompleted);
    ambiarc.registerForEvent(ambiarc.eventLabel.StartedLoadingMap, mapStartedLoading);
    ambiarc.registerForEvent(ambiarc.eventLabel.FinishedLoadingMap, mapFinishedLoading);
    var full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+(window.location.pathname ? window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/")) : '');
    ambiarc.setMapAssetBundleURL(full+'/ambiarc/');
    ambiarc.loadMap("pratt");

  };

  var mapStartedLoading = function() {

  }

  var mapFinishedLoading = function() {
    // creating objecct where we will store all our points property values
    ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

    ambiarc.hideLoadingScreen();

    ambiarc.getAllBuildings(function(buildingsArray){
      buildingsArray.forEach(function(bldgID, i){
        ambiarc.getBuildingLabelID(bldgID, function(id){
          var poiObject = {};
          poiObject.label = "test";
          poiObject.type = "Icon"
          poiObject.location = "URL"
          poiObject.partialPath = "/icons/ic_expand.png"
          poiObject.collapsedIconPartialPath = "/icons/ic_expand.png"
          poiObject.collapsedIconLocation = "URL"
          poiObject.ignoreCollision = false;
          ambiarc.updateMapLabel(id, ambiarc.mapLabel.Icon, poiObject);
        });
      });
    });
    $('#bootstrap').removeAttr('hidden');
    $('#back-button').hide();
    ambiarc.setMapTheme(ambiarc.mapTheme.light);



	/// testing getDirections here
    setTimeout(function(){

		ambiarc.UpdateHandicapLevel('Full');

		//ambiarc.getDirections('', '', 40.690354, -73.964872, '', '', 40.691807, -73.963063, function(res){ console.log(res); }); /// entrance to CHEM works good

		//ambiarc.getDirections('', '', 40.690354, -73.964872, '', '', 40.690771, -73.964910, function(res){ console.log(res); }); /// LIB miss
		//ambiarc.getDirections('', '', 40.690354, -73.964872, '', '', 40.691706, -73.964910, function(res){ console.log(res); }); /// ISC miss
		//ambiarc.getDirections('', '', 40.690354, -73.964872, '', '', 40.691595, -73.963760, function(res){ console.log(res); }); /// SU miss
		//ambiarc.getDirections('', '', 40.690354, -73.964872, '', '', 40.688051, -73.964423, function(res){ console.log(res); }); /// HH miss
		//ambiarc.getDirections('', '', 40.690354, -73.964872, '', '', 40.690094, -73.964195, function(res){ console.log(res); }); /// TRFT misses a bit not too bad tho
		//ambiarc.getDirections('', '', 40.690354, -73.964872, '', '', 40.690194, -73.963640, function(res){ console.log(res); }); ///PANT goes thru Jones Hall?
		//ambiarc.getDirections('', '', 40.690354, -73.964872, '', '', 40.690134, -73.964545, function(res){ console.log(res); }); /// DEK miss

		ambiarc.getDirections('', '', 40.690354, -73.964872, '', '', 40.690771, -73.964910, function(res){ console.log(res); }); /// entrance to LIB misses

		ambiarc.focusOnLatLonAndZoomToHeight('', '', 40.690771, -73.964910, '125');

    },1000);




  }

//Event callback handlers
var onRightMouseDown = function(event) {
  console.log("Ambiarc received a RightMouseDown event");
}

var BuildingExitCompleted = function(event) {
  currentFloorId = undefined;
  currentBldgID = undefined;
  $('#back-button').hide();
}


var onFloorSelected = function(event) {
 var floorInfo = event.detail;
 currentFloorId = floorInfo.floorId;

 $('#back-button').show();
 isFloorSelectorEnabled = false;

 currentBldgID = floorInfo.buildingId;
 console.log("Ambiarc received a FloorSelected event with a buildingId of " + floorInfo.buildingId + " and a floorId of " + floorInfo.floorId);
}

var onEnteredFloorSelector = function(event) {
 var buildingId = event.detail;
 currentFloorId = undefined;
 currentBldgID = buildingId;
 $('#back-button').show();
 isFloorSelectorEnabled = true;

 console.log("Ambiarc received a FloorSelectorEnabled event with a building of " + buildingId);
}

var onExitedFloorSelector = function(event) {
 var buildingId = event.detail;
 currentFloorId = undefined;
 buildingId = undefined;
 isFloorSelectorEnabled = false;
 console.log("Ambiarc received a FloorSelectorEnabled event with a building of " + buildingId);
}

var onFloorSelectorFocusChanged = function(event) {
 console.log("Ambiarc received a FloorSelectorFocusChanged event with a building id of: " + event.detail.buildingId +
   " and a new floorId of " + event.detail.newFloorId + " coming from a floor with the id of " + event.detail.oldFloorId);
}


//Rotate handlers
var rotateLeft = function(){
  var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
  ambiarc.rotateCamera(-45, 0.2);
  $('#rotate_left').removeAttr('onclick');
  setTimeout(function(){ $('#rotate_left').attr('onclick', 'rotateLeft(this);');  }, 500);
};
var rotateRight = function(){
 var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
 ambiarc.rotateCamera(45, 0.2);
 $('#rotate_right').removeAttr('onclick');
 setTimeout(function(){ $('#rotate_right').attr('onclick', 'rotateRight(this);'); }, 500);
};

var zoomOutHandler = function(){
  var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
  ambiarc.zoomCamera(-0.2, 0.3);

};
var zoomInHandler = function(){

 var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
 ambiarc.zoomCamera(0.2, 0.3);
};

