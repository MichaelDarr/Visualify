var container = $("#trippyContainer");
var scope = new Graphemescope( container[0] );

scope.setImage('https://i.ytimg.com/vi/8-YqwbawQ5k/maxresdefault.jpg')

// Двигаем
scope.zoomTarget  = 2.0;
scope.angleTarget = 0.5;

setInterval(function() {
  scope.zoomTarget  = scope.zoomTarget + .005;
  scope.angleTarget = scope.angleTarget + .005;
}, 100)

setInterval(function() {
  var curAlbumArt = $('#geoHelper').html()
  console.log(curAlbumArt)
  scope.setImage(curAlbumArt)
}, 1000)
