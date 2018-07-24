var container = $("#trippyContainer");
var scope = new Graphemescope( container[0] );

scope.setImage('https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/yI9FRzo/pouring-of-lentils-on-white-background-this-video-was-shoot-using-custom-light-set-up-with-additional-custom-build-underneath-light-system-to-eliminate-shadows_n17dyaafx__S0000.jpg')

// Двигаем
scope.zoomTarget  = 1.5;
scope.angleTarget = 0.5;
scope.zoomIn      = true;

var zoomIn = false;

var beatCounter = 4;
var counter = 0;
var beatsPerMS = 1000;
var steadyZoomSpeed = 0.005;
var zoomSpeed = 0.02;

setInterval(function() {
  scope.angleTarget = scope.angleTarget + .002;

  if(zoomIn) {
    scope.zoomTarget = scope.zoomTarget + zoomSpeed
  }
  else {
    scope.zoomTarget = scope.zoomTarget - zoomSpeed
  }

  /*
   * GENERAL
   */

   if(scope.zoomIn) {
     scope.zoomTarget  = scope.zoomTarget + steadyZoomSpeed;
   }
   else {
     scope.zoomTarget  = scope.zoomTarget - steadyZoomSpeed;
   }

}, 100)

setInterval(function() {
  var curAlbumArt = $('#geoHelper').html();
  scope.setImage(curAlbumArt);
}, 100);

setInterval(function() {
  beatsPerMS = 60000 / $('#bpmHelper').html();
}, 1000);

var pulse = function() {
  /*
   * PULSE
   */
  console.log('BEAT')
  console.log(beatCounter)
  zoomIn = !zoomIn;

  if(beatCounter === 17) {
    console.log('SHWAP')
    scope.zoomIn = !scope.zoomIn;
    beatCounter = 0;
  }
  beatCounter++;
  setTimeout(pulse, beatsPerMS);
}
setTimeout(pulse, beatsPerMS);
