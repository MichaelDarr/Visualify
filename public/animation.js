var container = $("#trippyContainer");
var scope = new Graphemescope( container[0] );

scope.setImage('https://i.ytimg.com/vi/8-YqwbawQ5k/maxresdefault.jpg')

// Двигаем
scope.zoomTarget  = 2.0;
scope.angleTarget = 0.5;
scope.zoomIn      = true;

var zoomIn = true;

setInterval(function() {
  scope.angleTarget = scope.angleTarget + .003;
  if(scope.zoomIn) {
    scope.zoomTarget  = scope.zoomTarget + .005;
  }
  else {
    scope.zoomTarget  = scope.zoomTarget - .005;
  }

  if(scope.zoomTarget > 2.0) {
    scope.zoomIn = false
  }
  else if(scope.zoomTarget < 0.3) {
    scope.zoomIn = true
  }

}, 100)

setInterval(function() {
  var curAlbumArt = $('#geoHelper').html()
  scope.setImage(curAlbumArt)
}, 1000)
