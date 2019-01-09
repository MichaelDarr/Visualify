<template>
  <div class="main-console">
    <h1 class="console-heading">Visualify Console</h1>

    <h3 class="slider-label">Spin Rate
      &nbsp;
      <span class="disable-text" v-on:click="resetSpin">(reset)</span>
      &nbsp;
      <span class="disable-text" v-on:click="disableSpin">(disable)</span>
    </h3>
    <vue-slider
      ref="spinnerSlider"
      v-model="albumArtSpinRate"
      v-bind="spinSliderOptions"
    ></vue-slider>

    <h3 class="slider-label">Pattern Size
      &nbsp;
      <span class="disable-text" v-on:click="resetPattern">(reset)</span>
    </h3>
    <vue-slider
      ref="triangleSizeSlider"
      v-model="triangleWidth"
      v-bind="TriangleWidthSliderOptions"
    ></vue-slider>

    <h3 class="slider-label">Art Zoom Speed
      &nbsp;
      <span class="disable-text" v-on:click="resetZoomRate">(reset)</span>
      &nbsp;
      <span class="disable-text" v-on:click="disableZoom">(disable)</span>
    </h3>
    <vue-slider
      ref="albumArtZoomRateSlider"
      v-model="albumArtZoomRate"
      v-bind="albumArtZoomRateOptions"
    ></vue-slider>

    <h3 class="slider-label">Art Zoom Window
      &nbsp;
      <span class="disable-text" v-on:click="resetZoomWindow">(reset)</span>
    </h3>
    <vue-slider
      ref="artZoomWindowSlider"
      v-model="albumArtZoomWindow"
      v-bind="albumArtZoomWindowOptions"
    ></vue-slider>

    <button
      class="btn"
      type="button"
      v-on:click="resetAll"
    >
      <span>Reset All</span>
    </button>

  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'

export default
  { computed:
    { albumArtSpinRate:
      { get() {
          // scales down and linear-izes the stored spin rate for the slider
          return Math.sqrt(this.$store.state.albumArtSpinRate / 15)
        }
      , set(newVal) {
          // normalizes the spin rate before storage
          var conserveSign = (newVal < 0) ? -1 : 1
          this.$store.commit('setAlbumArtSpinRate', Math.pow(newVal, 2) * 15 * conserveSign)
        }
      }
      , triangleWidth:
        { get() {
            return Math.sqrt(this.$store.state.triangleWidth / 50)
          }
        , set(newVal) {
            var adjustedVal = Math.pow(newVal, 2) * 50
            if(adjustedVal <= 1) return 1
            this.$store.commit('setTriangleWidth', adjustedVal)
          }
        }
      , albumArtZoomWindow:
        { get() {
            return this.$store.state.albumArtZoomWindow
          }
        , set(newVal) {
            this.$store.commit('setAlbumArtZoomWindow', newVal)
          }
        }
      , albumArtZoomRate:
        { get() {
            return Math.sqrt(this.$store.state.albumArtZoomRate)
          }
        , set(newVal) {
            this.$store.commit('setAlbumArtZoomRate', Math.pow(newVal, 2))
          }
        }
    }
  , components:
    { vueSlider
    }
  , data() {
      return (
        // set out parameters for each slider
        { spinSliderOptions:
          { min       : -1
          , max       : 1
          , interval  : .001
          , formatter : (v) => `${Math.round(Math.pow(v, 2) * 50 * 60) * ((v < 0) ? -1 : 1)} rpm`
          }
        , TriangleWidthSliderOptions:
          { min       : .2
          , max       : 1
          , interval  : .01
          , formatter : (v) => `${Math.round(Math.pow(v, 2) * 50)}% of screen`
          , lazy      : true
          , disabled  : this.$store.state.isLoadingImage
          }
        , albumArtZoomWindowOptions:
          { min       : .4
          , max       : 3
          , interval  : .01
          , formatter : (v) => `${Math.round(v * 10) / 10}x`
          }
        , albumArtZoomRateOptions:
          { min       : 0
          , max       : 1
          , interval  : .01
          , formatter : (v) => `${Math.round(Math.pow(v, 2) * 60)}px / sec`
          }
        }
      )
    }
  , methods:
    { disableSpin: function() {
        this.$refs.spinnerSlider.setValue(0)
        this.$store.commit('resetTriangleRotation')
      }
    , resetSpin: function() {
        this.$store.commit('setAlbumArtSpinRate', Number(process.env.VUE_APP_ALBUM_ART_SPIN_RATE_DEFAULT))
      }
    , resetPattern: function() {
        this.$store.commit('setTriangleWidth', Number(process.env.VUE_APP_TRIANGLE_WIDTH_DEFAULT))
      }
    , resetZoomRate: function() {
        this.$store.commit('setAlbumArtZoomRate', Number(process.env.VUE_APP_ALBUM_ART_ZOOM_RATE_DEFAULT))
      }
    , disableZoom: function() {
        this.$store.commit('setAlbumArtZoomRate', 0)
      }
    , resetZoomWindow: function() {
        this.$store.commit('setAlbumArtZoomWindow', [Number(process.env.VUE_APP_ZOOM_FLOOR_DEFAULT), Number(process.env.VUE_APP_ZOOM_CEIL_DEFAULT)])
      }
    , resetAll: function() {
        this.resetSpin()
        this.resetPattern()
        this.resetZoomRate()
        this.resetZoomWindow()
      }
    }
  }
</script>

<style scoped>

.console-heading {
  font-size: 1.7rem;
}

.main-console {
  position: absolute;
  max-width: 100%;
  width: 300px;
  height: 100vh;
  top: 0;
  right: 0;
  z-index: 99;
  background-color: white;
  box-shadow: 0 19px 38px rgba(0,0,0,0.70), 0 15px 12px rgba(0,0,0,0.50);
  padding: 10px 20px 10px 20px;
}

.slider-label {
  margin-bottom: 40px;
}

.disable-text {
  color: grey;
  font-size: .7rem;
  cursor: pointer;
  text-decoration: underline;
}

/* adapted from https://codepen.io/sebj54/pen/oxluI */
.btn {
  position: relative;

  display: block;
  margin: 30px 0 0 0;
  padding: 0;

  overflow: hidden;

  border-width: 0;
  outline: none;
  border-radius: 2px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .6);

  background-color: #3498db;
  color: #ecf0f1;
}

.btn:hover, .btn:focus {
  background-color: #1f74ad;
}

.btn span {
  position: relative;
  display: block;
  padding: 12px 24px;
}

</style>
