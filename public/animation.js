var container = $("#trippyContainer");
var scope = new Graphemescope( container[0] );

scope.setImage('https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/yI9FRzo/pouring-of-lentils-on-white-background-this-video-was-shoot-using-custom-light-set-up-with-additional-custom-build-underneath-light-system-to-eliminate-shadows_n17dyaafx__S0000.jpg')

// Двигаем
scope.zoomTarget  = 1.5;
scope.angleTarget = 0.5;
scope.zoomIn      = true;

var zoomIn = false;

var beatCounter     = 7
  , counter         = 0
  , beatsPerMS      = 1000
  , steadyZoomSpeed = 0.005
  , zoomSpeed       = 0.02
  , curAlbumArt     = null
  , minBPM          = 600
  , rotationSpeed   = 0.002

setInterval(function() {
  scope.angleTarget = scope.angleTarget + rotationSpeed;

  if($('#pulseHelper').html() === 'true') {
    if(zoomIn) {
      scope.zoomTarget = scope.zoomTarget + zoomSpeed
    }
    else {
      scope.zoomTarget = scope.zoomTarget - zoomSpeed
    }
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

  if(scope.image.src !== curAlbumArt) {
    scope.setImage(curAlbumArt);
    scope.zoomTarget  = 1.5;
    scope.angleTarget = 0.5;
  }
}, 100);

setInterval(function() {
  var temp = 60000 / $('#bpmHelper').html();

  if(temp > (minBPM * 2)) temp = temp / 2;
  else if(temp < minBPM) temp = temp * 2;

  if(temp > minBPM && temp < (minBPM * 2)) {
    beatsPerMS = temp;
  }
}, 1000);

var pulse = function() {
  /*
   * PULSE
   */
  zoomIn = !zoomIn;

  if(beatCounter === 17) {
    scope.zoomIn = !scope.zoomIn;
    beatCounter = 0;
  }
  beatCounter++;
  setTimeout(pulse, beatsPerMS);
}
setTimeout(pulse, beatsPerMS);
