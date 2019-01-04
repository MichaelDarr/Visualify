<script>

import { mapGetters } from 'vuex'

// Helper function - converts screen % to pixel count
const percentWidthToPix = (percent, ctx) => Math.floor((ctx.canvas.width / 100) * percent)

export default
{ data() {
    return(
      { windowHeight  : 0
      , windowWidth   : 0
      }
    )
  }
, computed:
  // maps several variables from the vuex store to "this.x" for easy access
  { ...mapGetters(
      [ 'albumArtLoaded'
      , 'albumArt'
      , 'rotation'
      , 'albumArtWidth'
      , 'triangleWidth'
      , 'ctx'
      , 'sctx'
      ]
    )
    // we start with the triangle width as a percent of screen width. Then, we find
    // the height for an equilateral triangle based off of the formula (width / 2) * sqrt(3)
    // finally, convert percent width to pixels for a usable measurement
  , finalTriangleHeight() {
      return percentWidthToPix((this.triangleWidth / 2) * Math.sqrt(3), this.ctx)
    }
    // as above, start with triangle width as percentage, convert to pixels
  , finalTriangleWidth() {
      return percentWidthToPix(this.triangleWidth, this.ctx)
    }
    // album art width, again from percent to pixels
  , finalAlbumArtWidth() {
      return percentWidthToPix(this.albumArtWidth, this.ctx)
    }
  }
  // this is run in two scenarios - startup, and when a new album cover jumps in
  , render() {

    // if the canvas elements have not loaded, dont run this
    if(!this.ctx || !this.sctx) return

    // set up local copies of the height and width of the window. These will be used
    // later in the code for dynamic window resizing
    this.windowWidth  = window.innerWidth
    this.windowHeight = window.innerHeight

    // here, we start to set up a hidden canvas, sctx (sampling context). This is a 4x3 grid of
    // album covers as described in the "grid layout" section below. We will sample two different
    //portions of this canvas for alternating triangles on the grid to create an alligned tesselation
    // first, set up the height and width
    this.sctx.canvas.width = this.finalTriangleHeight * 4
    this.sctx.canvas.height = this.finalTriangleHeight * 3

    // create an image, load in the album art, and wait
    var img = new Image()
    img.src = this.albumArt

    img.onload = () => {
      // when the image has finished loading, store it in our vuex store
      this.$store.commit('loadAlbumArt', img)

      /* EXPLAINATION/RATIONALIZATION FOR THIS METHOD
       *
       * We're going to draw our album cover on this 4x3 grid in a way by which
       * every side of the image is aligned with another which is flipped and
       * rotated so that there are no "harsh" edges. This could be done with some
       * fancy loops, but that would be far less straightforward and significantly
       * more difficult to bugfix.
       * Anyway, when I started, I realized that every other triangle had to be flipped
       * horizontally in order to align with its neighbors when rotating. In addition,
       * each triangle needs to be filled with a grid of album covers at least 3x3,
       * as the cover can become smaller than the triangle it is trying to fill.
       * Instead of creating two 3x3 offscreen canvases to sample for flipped and
       * standard triangles, a single grid of 4x3 can be used which covers the patterns
       * required by both. Sampling different 3x3 portions of the 4x3 grid lets us
       * stick to one offscreen canvas for all draws
       */

      // save the context before we start manipulation
      this.sctx.save()

      /* GRID LAYOUT
       * U = upside-up | D = upside-down
       * R = reversed  | F = forwards
       *
       *  UF | UR | UF | UR
       * -------------------
       *  DF | DR | DF | DR
       * -------------------
       *  UF | UR | UF | UR
       */

      // start by drawing the two standard "DF" tiles
      this.sctx.drawImage(img, 0, 0, img.width, img.height, 0, this.finalTriangleHeight, this.finalTriangleHeight, this.finalTriangleHeight)
      this.sctx.drawImage(img, 0, 0, img.width, img.height, this.finalTriangleHeight * 2, this.finalTriangleHeight, this.finalTriangleHeight, this.finalTriangleHeight)

      // reverse it to take care of the two "DR" tiles
      this.sctx.scale(-1, 1)
      this.sctx.drawImage(img, 0, 0, img.width, img.height, -this.finalTriangleHeight, this.finalTriangleHeight, -this.finalTriangleHeight, this.finalTriangleHeight)
      this.sctx.drawImage(img, 0, 0, img.width, img.height, -this.finalTriangleHeight * 3, this.finalTriangleHeight, -this.finalTriangleHeight, this.finalTriangleHeight)

      // flip it, let's manage the fully flipped/reversed "UR" tiles
      this.sctx.scale(1, -1)
      this.sctx.drawImage(img, 0, 0, img.width, img.height, -this.finalTriangleHeight, 0, -this.finalTriangleHeight, -this.finalTriangleHeight)
      this.sctx.drawImage(img, 0, 0, img.width, img.height, -this.finalTriangleHeight * 3, 0, -this.finalTriangleHeight, -this.finalTriangleHeight)
      this.sctx.drawImage(img, 0, 0, img.width, img.height, -this.finalTriangleHeight, -this.finalTriangleHeight * 2, -this.finalTriangleHeight, -this.finalTriangleHeight)
      this.sctx.drawImage(img, 0, 0, img.width, img.height, -this.finalTriangleHeight * 3, -this.finalTriangleHeight * 2, -this.finalTriangleHeight, -this.finalTriangleHeight)

      // unreverse, handle the remaining "UF" tiles
      this.sctx.scale(-1, 1)
      this.sctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.finalTriangleHeight, -this.finalTriangleHeight)
      this.sctx.drawImage(img, 0, 0, img.width, img.height, this.finalTriangleHeight * 2, 0, this.finalTriangleHeight, -this.finalTriangleHeight)
      this.sctx.drawImage(img, 0, 0, img.width, img.height, 0, -this.finalTriangleHeight * 2, this.finalTriangleHeight, -this.finalTriangleHeight)
      this.sctx.drawImage(img, 0, 0, img.width, img.height, this.finalTriangleHeight * 2, -this.finalTriangleHeight * 2, this.finalTriangleHeight, -this.finalTriangleHeight)

      this.sctx.restore()
    }

    // Vue doesn't like it when you return nothing from a render function
    return "<p style='display:none'></p>"
  }
  , mounted() {

    // window resizing watcher
    this.$nextTick(() => {
      window.addEventListener('resize', () => {

        // when the window is resized, update the local copies
        this.windowWidth  = window.innerWidth
        this.windowHeight = window.innerHeight
      });
    })

    // trigger the first run of the spin animation!
    this.spin()
  }
  , watch:
    // when the window is resized, resize the canvas
    { windowHeight(newHeight) {
      this.ctx.canvas.height  = newHeight
      }
    , windowWidth(newWidth) {
        this.ctx.canvas.width   = newWidth
      }
    }
  , methods:
    // main control method for the animation. This is run every "animation frame"
    { spin: function() {

        // if the contexts or album art have not been loaded, ditch this frame and try again
        if(!this.ctx || !this.sctx || !this.albumArtLoaded) {
          window.requestAnimationFrame(this.spin)
          return
        }

        // determine the number of columns and rows of triangles needed to fit the screen
        var numOfRows = Math.ceil(this.windowHeight / this.finalTriangleHeight)
          , numOfCols = Math.ceil(this.windowWidth * 2 / this.finalTriangleWidth) + 1

        // main animation loop - runs for each calculated triangle
        for(var row = 0; row < numOfRows; row++) {
          for(var col = 0; col < numOfCols; col++) {

            // save the grid state of the canvas to return to for next triangle
            this.ctx.save()

            // clip out the correct portion of the screen for the triangle at a coordinate
            this.drawPath(row, col)

            // rotate the canvas for a given coordinate
            this.translateCanvas(row, col)

            // draw the rotated album grid on the canvas
            this.drawTriangleGrid(row, col)

            // restore the canvas (basically the grid) to its previous state
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
    // clips out a triangle-shaped portion of the screen
    , drawPath: function(row, col) {

        // fetch three correct triangle points given coordinates
        const triangle = this.trianglePoints(row, col)

        // use these points to clip the grid
        this.ctx.beginPath()
        this.ctx.moveTo(triangle.one.x, triangle.one.y)
        this.ctx.lineTo(triangle.two.x, triangle.two.y)
        this.ctx.lineTo(triangle.three.x, triangle.three.y)

        this.ctx.closePath()
        this.ctx.clip()
      }
    // rotates the canvas at the center of the triangle
    , translateCanvas: function(row, col) {

        // find base coordinates
        var xCoord = this.xCoord(col)
          , yCoord = this.yCoord(row, col)

        // move the canvas to the center of the triangle
        this.ctx.translate(xCoord, yCoord)

        // each column rotates opposite to its neighbors. Flip every other rotation
        var isOddRow = (row % 2) ? 0 : 1
          , finalRotation = (col % 2 == isOddRow) ? -1 : 1

        // each column rotates 60 degress further than its left neighbor
        var degreesFinalRotation = (col * 60) + this.rotation

        // every other row rotates 180 degrees off to keep alignment
        degreesFinalRotation += (row % 2 == 0) ? 180 : 0

        // with all caluclations done, convert degrees to radians, rotate, and move back to the original position
        this.ctx.rotate(degreesFinalRotation * finalRotation  * Math.PI / 180)
        this.ctx.translate(-xCoord, -yCoord)

      }
    // draws the grid from the offscreen canvas onto the correct triangle location
    , drawTriangleGrid: function(row, col) {

        // get coordinates of the top-left corner where we need to draw the album art grid
        var xCoord = this.xCoord(col) - (1.5 * this.finalAlbumArtWidth)
          , yCoord = this.yCoord(row, col) - (1.5 * this.finalAlbumArtWidth)

        // choose which slice of the 4x3 grid to draw based on row and column, then draw it
        var isOddRow = (row % 2) ? 0 : 1
          , canvasOffset = (col % 2 == isOddRow) ? 0 : this.sctx.canvas.width / 4

        this.ctx.drawImage(this.sctx.canvas, canvasOffset, 0, this.sctx.canvas.height, this.sctx.canvas.height, xCoord, yCoord, this.finalAlbumArtWidth * 3, this.finalAlbumArtWidth * 3)
      }
    // choose the three correct points to draw a triangle at a given coordinate
    , trianglePoints(row, col) {

        // final object to store the points
        var triangle =
          { one   : {}
          , two   : {}
          , three : {}
          }

        // evenly spaced x coordinates
        var startX  = this.xCoord(col) - (this.finalTriangleWidth * .5)

        triangle.one.x    = startX
        triangle.two.x    = startX + (this.finalTriangleWidth / 2)
        triangle.three.x  = startX + this.finalTriangleWidth

        // y coordinates alternate based on row and column
        var startY  = this.finalTriangleHeight * row
          , endY    = startY + this.finalTriangleHeight
          , isOddRow = (row % 2) ? 0 : 1

        triangle.one.y    = (col % 2 == isOddRow) ? startY : endY
        triangle.two.y    = (col % 2 == isOddRow) ? endY   : startY
        triangle.three.y  = (col % 2 == isOddRow) ? startY : endY

        return triangle
      }
    // calulates the x coordinate in the middle of a triangle at a given column
    , xCoord(col) {
        return .5 * this.finalTriangleWidth * col
      }
    // calulates the y coordinate in the middle of a triangle at a given row and column
    , yCoord(row, col) {
        var yCoord = this.finalTriangleHeight * ((2 * row) + 1) / 2

        var isOddRow      = (row % 2) ? 0 : 1
          , heightOffset  = this.finalTriangleHeight / 6

        yCoord += ((col % 2 == isOddRow) ? (-heightOffset) : (heightOffset))

        return yCoord
      }
  }
}
</script>
