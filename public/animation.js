var container = $("#trippyContainer");
var scope = new Graphemescope( container[0] );

scope.setImage('https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/yI9FRzo/pouring-of-lentils-on-white-background-this-video-was-shoot-using-custom-light-set-up-with-additional-custom-build-underneath-light-system-to-eliminate-shadows_n17dyaafx__S0000.jpg')

// Двигаем
scope.zoomTarget  = 1.5;
scope.angleTarget = 0.5;
scope.zoomIn      = true;

var zoomIn = false;

var beatCounter = 4;
var beatsPerMS = 100;
var steadyZoomSpeed = 0.005;
var defaultZoomSpeed = 0.005
var minBPM = 600;
var zoomBeats = 16;
var rotationSpeed = .002;

var zoomSpeed = defaultZoomSpeed;

setInterval(function() {
  scope.angleTarget = scope.angleTarget + rotationSpeed;

  if(zoomIn) {
    scope.zoomTarget = scope.zoomTarget + zoomSpeed
  }
  else {
    scope.zoomTarget = scope.zoomTarget - zoomSpeed
  }

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

  if(beatCounter === (zoomBeats + 1)) {
    scope.zoomIn = !scope.zoomIn;
    beatCounter = 0;
  }
  beatCounter++;

  zoomSpeed = defaultZoomSpeed;

  setTimeout(() => {
    zoomSpeed = defaultZoomSpeed * 2;
  }, (beatsPerMS / 4));

  setTimeout(() => {
    zoomSpeed = defaultZoomSpeed * 4;
  }, (beatsPerMS / 2));

  setTimeout(() => {
    zoomSpeed = defaultZoomSpeed * 2;
  }, ((3 * beatsPerMS) / 4));


  setTimeout(pulse, beatsPerMS);
}
setTimeout(pulse, beatsPerMS);
