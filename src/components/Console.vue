<template>
  <div class="main-console">
    <div class="console-header">
      <h1 class="console-heading">Visualify</h1>
    </div>

    <div class="console-body">
      <h2 class="console-subheading">CONTROLS</h2>
      <div class="control-container">
        <div class="key-icon-description-holder">
          <div
            class="control-height-helper"
            v-for="control in controlList"
            v-bind:key="control.label"
          >
            <p class="control-helper">{{control.label}}</p>
          </div>
        </div>
        <div class="key-icon-holder">
          <div
            class="icon-height-helper"
            v-for="control in controlList"
            v-bind:key="control.label"
          >
            <p class="control-key" v-on:click="simulateKeypress(control.keyCode)">{{control.keyName}}</p>
          </div>
        </div>
      </div>

      <h2 class="console-subheading">CUSTOMIZATION</h2>

      <ConsoleControlModule
        controlTitle     ="spin rate"
        :sliderGet       ="getSpinRate"
        :sliderSet       ="setSpinRate"
        :sliderOptions   ="spinSliderOptions"
        :resetFunction   ="resetSpin"
        :disableFunction ="disableSpin"
      />

      <ConsoleControlModule
        controlTitle     ="pattern size"
        :sliderGet       ="getTriangleWidth"
        :sliderSet       ="setTriangleWidth"
        :sliderOptions   ="TriangleWidthSliderOptions"
        :resetFunction   ="resetPattern"
      />

      <ConsoleControlModule
        controlTitle     ="zoom speed"
        :sliderGet       ="getAlbumArtZoomRate"
        :sliderSet       ="setAlbumArtZoomRate"
        :sliderOptions   ="albumArtZoomRateOptions"
        :resetFunction   ="resetZoomRate"
        :disableFunction ="disableZoom"
      />

      <ConsoleControlModule
        controlTitle     ="zoom window"
        :sliderGet       ="getAlbumArtZoomWindow"
        :sliderSet       ="setAlbumArtZoomWindow"
        :sliderOptions   ="albumArtZoomWindowOptions"
        :resetFunction   ="resetZoomWindow"
      />

      <button
        class="btn reset-all-button"
        type="button"
        v-on:click="resetAll"
      >
        <span>RESET ALL</span>
      </button>
    </div>
  </div>
</template>

<script>

import ConsoleControlModule from './ConsoleControlModule.vue'

export default
{ components:
  { ConsoleControlModule
  }
, data() {
    return (
      // set out parameters for each slider
      { controlList:
        [ { label   : 'previous song'
          , keyName : '←'
          , keyCode : 'ArrowLeft'
          }
        , { label   : 'nextSong'
          , keyName : '→'
          , keyCode : 'ArrowRight'
          }
        , { label   : 'toggle fullscreen'
          , keyName : 'F'
          , keyCode : 'KeyF'
          }
        , { label   : 'show/hide controls'
          , keyName : 'C'
          , keyCode : 'KeyC'
          }
        , { label   : 'mute playback'
          , keyName : 'M'
          , keyCode : 'KeyM'
          }
        , { label   : 'play/pause song'
          , keyName : 'space'
          , keyCode : 'Space'
          }
        ]
      , spinSliderOptions:
        { min           : -1
        , max           : 1
        , interval      : .001
        , formatter     : (v) => `${Math.round(Math.pow(v, 2) * 50 * 60) * ((v < 0) ? -1 : 1)} rpm`
        , processStyle  : {backgroundColor: '#1db954'}
        , bgStyle       : {backgroundColor: '#b3b3b3'}
        , tooltipStyle  :
          { backgroundColor : '#282828'
          , borderColor     : '#282828'
          , borderRadius    : '2px'
          , color           : '#b3b3b3'
          , fontFamily      : 'Montserrat'
          , fontSize        : '0.8rem'
          }
        }
      , TriangleWidthSliderOptions:
        { min       : .2
        , max       : 1
        , interval  : .01
        , formatter : (v) => `${Math.round(Math.pow(v, 2) * 50)}% of screen`
        , lazy      : true
        , disabled  : this.$store.state.isLoadingImage
        , processStyle  : {backgroundColor: '#1db954'}
        , bgStyle       : {backgroundColor: '#b3b3b3'}
        , tooltipStyle  :
          { backgroundColor : '#282828'
          , borderColor     : '#282828'
          , borderRadius    : '2px'
          , color           : '#b3b3b3'
          , fontFamily      : 'Montserrat'
          , fontSize        : '0.8rem'
          }
        }
      , albumArtZoomWindowOptions:
        { min       : .4
        , max       : 3
        , interval  : .01
        , formatter : (v) => `${Math.round(v * 10) / 10}x`
        , processStyle  : {backgroundColor: '#1db954'}
        , bgStyle       : {backgroundColor: '#b3b3b3'}
        , tooltipStyle  :
          { backgroundColor : '#282828'
          , borderColor     : '#282828'
          , borderRadius    : '2px'
          , color           : '#b3b3b3'
          , fontFamily      : 'Montserrat'
          , fontSize        : '0.8rem'
          }
        }
      , albumArtZoomRateOptions:
        { min       : 0
        , max       : 1
        , interval  : .01
        , formatter : (v) => `${Math.round(Math.pow(v, 2) * 60)}px / sec`
        , processStyle  : {backgroundColor: '#1db954'}
        , bgStyle       : {backgroundColor: '#b3b3b3'}
        , tooltipStyle  :
          { backgroundColor : '#282828'
          , borderColor     : '#282828'
          , borderRadius    : '2px'
          , color           : '#b3b3b3'
          , fontFamily      : 'Montserrat'
          , fontSize        : '0.8rem'
          }
        }
      }
    )
  }
, methods:
  { getSpinRate() {
      // prevent crashes from taking the square root of a negative
      var conserveSign     = (this.$store.state.albumArtSpinRate < 0) ? -1 : 1
        , absoluteSpinRate = this.$store.state.albumArtSpinRate * conserveSign
      // scales down and linear-izes the stored spin rate for the slider
      return Math.sqrt(absoluteSpinRate / 15) * conserveSign
    }
  , setSpinRate(newVal) {
      // normalizes the spin rate before storage
      var conserveSign = (newVal < 0) ? -1 : 1
      this.$store.commit('setAlbumArtSpinRate', Math.pow(newVal, 2) * 15 * conserveSign)
    }
  , getTriangleWidth() {
      return Math.sqrt(this.$store.state.triangleWidth / 50)
    }
  , setTriangleWidth(newVal) {
      var adjustedVal = Math.pow(newVal, 2) * 50
      if(adjustedVal <= 1) return 1
      this.$store.commit('setTriangleWidth', adjustedVal)
    }
  , getAlbumArtZoomWindow() {
      return this.$store.state.albumArtZoomWindow
    }
  , setAlbumArtZoomWindow(newVal) {
      this.$store.commit('setAlbumArtZoomWindow', newVal)
    }
  , getAlbumArtZoomRate() {
      return Math.sqrt(this.$store.state.albumArtZoomRate)
    }
  , setAlbumArtZoomRate(newVal) {
      this.$store.commit('setAlbumArtZoomRate', Math.pow(newVal, 2))
    }
  , disableSpin: function() {
      this.$store.commit('setAlbumArtSpinRate', 0)
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
  , simulateKeypress: function(code) {
      var evt = new KeyboardEvent('keyup', {code})
      window.dispatchEvent(evt)
    }
  }
}
</script>

<style scoped>

.console-heading {
  font-size: 1.7rem;
  font-weight: normal;
  color: white;
}

.console-subheading {
  margin: 30px 0 10px 0;
  font-weight: normal;
  font-size: .9rem;
  letter-spacing: 2px;
}

.main-console {
  position: absolute;
  box-sizing: border-box;
  max-width: 100%;
  width: 280px;
  height: 100vh;
  max-height: 100vh;
  overflow-y: hidden;
  overflow-x: hidden;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: #121212;
  color: #7f7f7f;
  display: flex;
  flex-direction: column;
}

.console-header {
  background-color: #181818;
  border-bottom: 1px solid #282828;
  padding: 10px 20px 10px 20px;
}

.console-body {
  padding: 0px 20px 20px 20px;
  overflow-y: scroll;
  overflow-x: hidden;
  flex-grow: 1;
}

/* scrollbar code */
.console-body::-webkit-scrollbar-track {
	background-color: #121212;
}

.console-body::-webkit-scrollbar {
	background-color: #7f7f7f;
  width: 16px;
}

.console-body::-webkit-scrollbar-button:vertical:increment {
  background-image: url("~@/assets/downArrow.png");
  background-size: 100% 100%;
  width: 16px;
  height: 16px;
}

.console-body::-webkit-scrollbar-button:vertical:decrement {
  background-image: url("~@/assets/upArrow.png");
  background-size: 100% 100%;
  width: 16px;
  height: 16px;
}

.console-body::-webkit-scrollbar-button {
  background-color: #121212;
}

.console-body::-webkit-scrollbar-thumb {
	background-color: #7f7f7f;
}

/* adapted from https://codepen.io/sebj54/pen/oxluI */
.btn {
  position: relative;
  cursor: pointer;
  display: block;
  margin: 30px 0 20px 0;
  padding: 0;
  overflow: hidden;
  border-width: 0;
  outline: none;
  border-radius: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .6);
  background-color: #282828;
  color: #7f7f7f;
  transition: background-color 0.2s ease;
}

.btn:hover {
  background-color: #323232;
}

.btn span {
  position: relative;
  display: block;
  padding: 12px 24px;
}

.reset-all-button {
  margin: 30px auto 0 auto;
  letter-spacing: 2px;
  font-size: .8rem;
  color: white;
}

.control-container {
  display: flex;
}

.key-icon-holder {
  width: auto;
  float: right;
  flex-grow: 1;
}

.key-icon-description-holder {
  float: left;
}

.control-helper {
  margin: 0 20px 10px 0;
  font-size: 0.9rem;
}

.control-key {
  display: inline-block;
  font-family: monospace;
  font-size: .9rem;
  background-color: #282828;
  border-radius: 10px;
  padding: 2px 10px 5px 10px;
  margin: -1px -5px 0 0;
  color: white;
  cursor: pointer;
  float: right;
  transition: all 0.2s ease;
}

.control-key:hover {
  background-color: #323232;
}

.icon-height-helper {
  height: 24px;
}

.control-height-helper {
  height: 24px;
}

</style>
