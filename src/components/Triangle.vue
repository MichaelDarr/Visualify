<script>

import { mapGetters } from 'vuex'

// Helper functions to convert a percentage of canvas area to pixels.
const percentWidthToPix = (percent, ctx) => Math.floor((ctx.canvas.width / 100) * percent)
const percentHeightToPix = (percent, ctx) => Math.floor((ctx.canvas.height / 100) * percent)

export default
{ inject: ['provider']
, props:
  { x:
    { type    : Number
    , default : 0
    }
  , y:
    { type    : Number
    , default : 0
    }
  , width:
    { type    : Number
    , default : 30
    }
  }
, computed:
  { ...mapGetters(
      [ 'albumArtLoaded'
      , 'albumArt'
      , 'rotation'
      , 'ctx'
      ]
    )
  , finalHeight() {
      return percentWidthToPix((this.width / 2) * Math.sqrt(3), this.ctx)
    }
  , finalWidth() {
      return percentWidthToPix(this.width, this.ctx)
    }
  , finalX() {
      return percentWidthToPix(this.x, this.ctx)
    }
  , finalY() {
      return percentWidthToPix(this.y, this.ctx)
    }
  , xOffset() {
      return (this.finalWidth - this.finalHeight) / 2
    }
  , pointOne() {
      return(
        { x: this.finalX + (this.finalWidth / 2)
        , y: this.finalY
        }
      )
    }
  , pointTwo() {
    return(
        { x: this.finalX + this.finalWidth
        , y: this.finalY + this.finalHeight
        }
      )
    }
  , pointThree() {
      return(
        { x: this.finalX
        , y: this.finalY + this.finalHeight
        }
      )
    }
  , trianglePoints () {
      const triangle =
        { one       : this.pointOne
        , two       : this.pointTwo
        , three     : this.pointThree
        }

      return triangle
    }
  }
  , render() {
    if(!this.ctx) return

    var img = new Image()
    img.src = this.albumArt

    console.log('loading image')

    img.onload = () => {
      console.log('image loaded')
      var pattern = this.ctx.createPattern(img, 'repeat')

      this.ctx.fillStyle = pattern

      this.$store.commit('loadAlbumArt', img)
    }

    return "<p style='display:none'></p>"
  }
  , methods:
    { spin: function() {

        if(!this.ctx) return

        if(!this.albumArtLoaded) return

        const triangle = this.trianglePoints

        this.ctx.beginPath()
        this.ctx.moveTo(triangle.one.x, triangle.one.y)
        this.ctx.lineTo(triangle.two.x, triangle.two.y)
        this.ctx.lineTo(triangle.three.x, triangle.three.y)

        this.ctx.closePath()
        this.ctx.clip()

        this.ctx.save()

        this.ctx.translate((this.finalHeight / 2) + this.xOffset, this.finalHeight / 2)
        this.ctx.rotate(this.rotation)
        this.ctx.translate(-1 * ((this.finalHeight) / 2), -1 * ((this.finalHeight) / 2))

        this.ctx.drawImage(this.albumArtLoaded, this.finalX - this.finalHeight, this.finalY - this.finalHeight, this.finalHeight, this.finalHeight)
        this.ctx.drawImage(this.albumArtLoaded, this.finalX, this.finalY - this.finalHeight, this.finalHeight, this.finalHeight)
        this.ctx.drawImage(this.albumArtLoaded, this.finalX + this.finalHeight, this.finalY - this.finalHeight, this.finalHeight, this.finalHeight)

        this.ctx.drawImage(this.albumArtLoaded, this.finalX - this.finalHeight, this.finalY, this.finalHeight, this.finalHeight)
        this.ctx.drawImage(this.albumArtLoaded, this.finalX, this.finalY, this.finalHeight, this.finalHeight)
        this.ctx.drawImage(this.albumArtLoaded, this.finalX + this.finalHeight, this.finalY, this.finalHeight, this.finalHeight)

        this.ctx.drawImage(this.albumArtLoaded, this.finalX - this.finalHeight, this.finalY + this.finalHeight, this.finalHeight, this.finalHeight)
        this.ctx.drawImage(this.albumArtLoaded, this.finalX, this.finalY + this.finalHeight, this.finalHeight, this.finalHeight)
        this.ctx.drawImage(this.albumArtLoaded, this.finalX + this.finalHeight, this.finalY + this.finalHeight, this.finalHeight, this.finalHeight)

        this.ctx.restore()
      }
  }
}
</script>
