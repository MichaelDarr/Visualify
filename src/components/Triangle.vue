<script>

import { mapGetters } from 'vuex'

// Helper functions to convert a percentage of canvas area to pixels.
const percentWidthToPix = (percent, ctx) => Math.floor((ctx.canvas.width / 100) * percent)

export default
{ inject: ['provider']
, props:
  { width:
    { type    : Number
    , default : 20
    }
  }
, computed:
  { ...mapGetters(
      [ 'albumArtLoaded'
      , 'albumArt'
      , 'rotation'
      , 'ctx'
      , 'fctx'
      , 'sctx'
      ]
    )
  , finalHeight() {
      return percentWidthToPix((this.width / 2) * Math.sqrt(3), this.ctx)
    }
  , finalWidth() {
      return percentWidthToPix(this.width, this.ctx)
    }
  }
  , render() {
    if(!this.ctx || !this.fctx) return

    this.sctx.canvas.width = this.finalHeight * 3
    this.sctx.canvas.height = this.finalHeight * 3

    this.fctx.canvas.width = this.finalHeight * 3
    this.fctx.canvas.height = this.finalHeight * 3

    var img = new Image()
    img.src = this.albumArt

    img.onload = () => {
      this.$store.commit('loadAlbumArt', img)

      this.fctx.save()
      this.fctx.scale(-1, 1)

      for(var i = 0; i < 9; i++) {
        var innerCol = (i % 3)
          , innerRow = Math.floor(i / 3)

        var leftMargin  = this.finalHeight * innerCol
          , topMargin   = this.finalHeight * innerRow

        this.sctx.drawImage(img, 0, 0, img.width, img.height, leftMargin, topMargin, this.finalHeight, this.finalHeight)
        this.fctx.drawImage(img, 0, 0, img.width, img.height, -leftMargin, topMargin, this.finalHeight * -1, this.finalHeight)
      }
      this.fctx.restore()
    }

    return "<p style='display:none'></p>"
  }
  , mounted() {
    this.spin()
  }
  , methods:
    { spin: function() {

        if(!this.ctx || !this.albumArtLoaded) {
          window.requestAnimationFrame(this.spin)
          return
        }

        for(var row = 0; row < 4; row++) {
          for(var col = 0; col < 12; col++) {
            this.ctx.save()

            this.drawPath(row, col)

            this.translateCanvas(row, col)

            this.drawTriangleGrid(row, col)

            this.ctx.restore()
          }
        }

        // iterate rotation modifier
        this.$store.commit('rotateTriangles')

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

        var xCoord = ((this.finalWidth * .5) * (col - 1)) + ((this.finalWidth - this.finalHeight) / 2) - this.finalHeight + (this.finalHeight * 1.5)

        var yCoord = (this.finalHeight * row) - this.finalHeight + (this.finalHeight * 1.5)

        var isOddRow      = (row % 2) ? 0 : 1
          , heightOffset  = this.finalHeight / 6

        yCoord += ((col % 2 == isOddRow) ? (-heightOffset) : (heightOffset))


        this.ctx.translate(xCoord, yCoord)

        var isOddRow = (row % 2) ? 0 : 1

        var finalRotation = (col % 2 == isOddRow) ? -1 : 1

        var degreesFinalRotation = (col * 60) + this.rotation

        degreesFinalRotation += (row % 2 == 0) ? 180 : 0

        this.ctx.rotate(degreesFinalRotation * finalRotation  * Math.PI / 180)
        this.ctx.translate(-xCoord, -yCoord)

      }
    , drawTriangleGrid: function(row, col) {

        var xCoord = ((this.finalWidth * .5) * (col - 1)) + ((this.finalWidth - this.finalHeight) / 2) - this.finalHeight

        var yCoord = (this.finalHeight * row) - this.finalHeight

        var isOddRow      = (row % 2) ? 0 : 1
          , heightOffset  = this.finalHeight / 6

        yCoord += ((col % 2 == isOddRow) ? (-heightOffset) : (heightOffset))

        var imageToDraw = (col % 2 == isOddRow) ? this.fctx.canvas : this.sctx.canvas

        this.ctx.drawImage(imageToDraw, 0, 0, imageToDraw.width, imageToDraw.height, xCoord, yCoord, this.finalHeight * 3, this.finalHeight * 3)
      }
    , trianglePoints(row, col) {

        var triangle =
          { one       : {}
          , two       : {}
          , three     : {}
          }

        var startX  = (this.finalWidth * col * .5) - (this.finalWidth * .5)

        triangle.one.x    = startX
        triangle.two.x    = startX + (this.finalWidth / 2)
        triangle.three.x  = startX + this.finalWidth

        var startY  = this.finalHeight * row
          , endY    = startY + this.finalHeight

        var isOddRow = (row % 2) ? 0 : 1

        triangle.one.y    = (col % 2 == isOddRow) ? startY : endY
        triangle.two.y    = (col % 2 == isOddRow) ? endY   : startY
        triangle.three.y  = (col % 2 == isOddRow) ? startY : endY

        return triangle
      }
  }
}
</script>
