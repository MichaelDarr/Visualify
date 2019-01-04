<script>

import { mapGetters } from 'vuex'

// Helper functions to convert a percentage of canvas area to pixels.
const percentWidthToPix = (percent, ctx) => Math.floor((ctx.canvas.width / 100) * percent)

export default
{ inject: ['provider']
, data() {
    return(
      { windowHeight  : 0
      , windowWidth   : 0
      }
    )
  }
, computed:
  { ...mapGetters(
      [ 'albumArtLoaded'
      , 'albumArt'
      , 'rotation'
      , 'albumArtWidth'
      , 'triangleWidth'
      , 'ctx'
      , 'fctx'
      , 'sctx'
      ]
    )
  , finalTriangleHeight() {
      return percentWidthToPix((this.triangleWidth / 2) * Math.sqrt(3), this.ctx)
    }
  , finalTriangleWidth() {
      return percentWidthToPix(this.triangleWidth, this.ctx)
    }
  , finalAlbumArtWidth() {
      return percentWidthToPix(this.albumArtWidth, this.ctx)
    }
  }
  , render() {

    if(!this.ctx || !this.fctx) return

    this.sctx.canvas.width = this.finalTriangleHeight * 3
    this.sctx.canvas.height = this.finalTriangleHeight * 3

    this.fctx.canvas.width = this.finalTriangleHeight * 3
    this.fctx.canvas.height = this.finalTriangleHeight * 3

    this.windowWidth  = window.innerWidth
    this.windowHeight = window.innerHeight

    var img = new Image()
    img.src = this.albumArt

    img.onload = () => {
      this.$store.commit('loadAlbumArt', img)
      this.$store.commit('setAlbumArtWidth', 10)

      this.fctx.save()
      this.fctx.scale(-1, 1)

      for(var i = 0; i < 9; i++) {
        var innerCol = (i % 3)
          , innerRow = Math.floor(i / 3)

        var leftMargin  = this.finalTriangleHeight * innerCol
          , topMargin   = this.finalTriangleHeight * innerRow

        this.sctx.drawImage(img, 0, 0, img.width, img.height, leftMargin, topMargin, this.finalTriangleHeight, this.finalTriangleHeight)
        this.fctx.drawImage(img, 0, 0, img.width, img.height, -leftMargin, topMargin, this.finalTriangleHeight * -1, this.finalTriangleHeight)
      }
      this.fctx.restore()
    }

    return "<p style='display:none'></p>"
  }
  , mounted() {

    this.$nextTick(() => {
      window.addEventListener('resize', () => {

        console.log(window.innerWidth)

        this.windowWidth  = window.innerWidth
        this.windowHeight = window.innerHeight
      });
    })

    this.spin()
  }
  , watch:
    { windowHeight(newHeight) {
      this.ctx.canvas.height  = newHeight
      }
    , windowWidth(newWidth) {
        this.ctx.canvas.width   = newWidth
      }
    }
  , methods:
    { spin: function() {

        if(!this.ctx || !this.albumArtLoaded) {
          window.requestAnimationFrame(this.spin)
          return
        }

        var numOfRows = Math.ceil(this.windowHeight / this.finalTriangleHeight)
          , numOfCols = Math.ceil(this.windowWidth * 2 / this.finalTriangleWidth) + 1

        for(var row = 0; row < numOfRows; row++) {
          for(var col = 0; col < numOfCols; col++) {
            this.ctx.save()

            this.drawPath(row, col)

            this.translateCanvas(row, col)

            this.drawTriangleGrid(row, col)

            this.ctx.restore()
          }
        }

        // iterate rotation modifier
        this.$store.commit('rotateTriangles')

        // pulse artwork
        this.$store.commit('pulseAlbumArt')

        // request that this be re-run on the next frame (stock is 60fps)
        window.requestAnimationFrame(this.spin)
      }
    , drawPath: function(row, col) {
        const triangle = this.trianglePoints(row, col)

        this.ctx.beginPath()
        this.ctx.moveTo(triangle.one.x, triangle.one.y)
        this.ctx.lineTo(triangle.two.x, triangle.two.y)
        this.ctx.lineTo(triangle.three.x, triangle.three.y)
        this.ctx.closePath()

        this.ctx.clip()
      }
    , translateCanvas: function(row, col) {

        var xCoord = ((this.finalTriangleWidth * .5) * (col - 1)) + ((this.finalTriangleWidth - this.finalAlbumArtWidth) / 2) - this.finalAlbumArtWidth + (this.finalAlbumArtWidth * 1.5)

        var yCoord = (this.finalTriangleHeight * row) + (this.finalTriangleHeight / 2)

        var isOddRow      = (row % 2) ? 0 : 1
          , heightOffset  = this.finalTriangleHeight / 6

        yCoord += ((col % 2 == isOddRow) ? (-heightOffset) : (heightOffset))

        this.ctx.translate(xCoord, yCoord)

        var finalRotation = (col % 2 == isOddRow) ? -1 : 1

        var degreesFinalRotation = (col * 60) + this.rotation

        degreesFinalRotation += (row % 2 == 0) ? 180 : 0

        this.ctx.rotate(degreesFinalRotation * finalRotation  * Math.PI / 180)
        this.ctx.translate(-xCoord, -yCoord)

      }
    , drawTriangleGrid: function(row, col) {

        var xCoord = ((this.finalTriangleWidth * .5) * (col - 1)) + ((this.finalTriangleWidth - this.finalAlbumArtWidth) / 2) - this.finalAlbumArtWidth

        var yCoord = (this.finalTriangleHeight * row) + (this.finalTriangleHeight / 2) - (this.finalAlbumArtWidth * 1.5)

        var isOddRow      = (row % 2) ? 0 : 1
          , heightOffset  = this.finalTriangleHeight / 6

        yCoord += ((col % 2 == isOddRow) ? (-heightOffset) : (heightOffset))

        var imageToDraw = (col % 2 == isOddRow) ? this.fctx.canvas : this.sctx.canvas

        this.ctx.drawImage(imageToDraw, 0, 0, imageToDraw.width, imageToDraw.height, xCoord, yCoord, this.finalAlbumArtWidth * 3, this.finalAlbumArtWidth * 3)
      }
    , trianglePoints(row, col) {

        var triangle =
          { one       : {}
          , two       : {}
          , three     : {}
          }

        var startX  = (this.finalTriangleWidth * col * .5) - (this.finalTriangleWidth * .5)

        triangle.one.x    = startX
        triangle.two.x    = startX + (this.finalTriangleWidth / 2)
        triangle.three.x  = startX + this.finalTriangleWidth

        var startY  = this.finalTriangleHeight * row
          , endY    = startY + this.finalTriangleHeight

        var isOddRow = (row % 2) ? 0 : 1

        triangle.one.y    = (col % 2 == isOddRow) ? startY : endY
        triangle.two.y    = (col % 2 == isOddRow) ? endY   : startY
        triangle.three.y  = (col % 2 == isOddRow) ? startY : endY

        return triangle
      }
  }
}
</script>
