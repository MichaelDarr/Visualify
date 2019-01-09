/* this file serves as the base of the program, creating our vue instance
 * however, more notably, it contains our vuex store
 */

import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Vuex)

/* store variable clarification
 *
 * ctx  : the main canvas context
 * sctx : the "standard canvas", which is hidden and contains the image grid we are sampling from
 */

const store = new Vuex.Store(
  { state:
    { albumArt            : null
    , songName            : null
    , artistName          : null
    , songbpm             : null
    , authToken           : null
    , rotation            : 0
    , albumArtSpinRate    : Number(process.env.VUE_APP_ALBUM_ART_SPIN_RATE_DEFAULT)
    , albumArtZoomRate    : Number(process.env.VUE_APP_ALBUM_ART_ZOOM_RATE_DEFAULT)
    , albumArtZoomWindow  : [Number(process.env.VUE_APP_ZOOM_FLOOR_DEFAULT), Number(process.env.VUE_APP_ZOOM_CEIL_DEFAULT)]
    , albumArtZoomIn      : true
    , albumArtZoomDisable : false
    , albumArtWidth       : Number(process.env.VUE_APP_TRIANGLE_WIDTH_DEFAULT)
    , albumArtLoaded      : null
    , triangleWidth       : Number(process.env.VUE_APP_TRIANGLE_WIDTH_DEFAULT)
    , isLoadingImage      : false
    , ctx                 : null
    , sctx                : null
    , consoleIsOpen       : false
    }
  , getters:
    { albumArt            : state => state.albumArt
    , songName            : state => state.songName
    , artistName          : state => state.artistName
    , authToken           : state => state.authToken
    , songbpm             : state => state.songbpm
    , rotation            : state => state.rotation
    , albumArtSpinRate    : state => state.albumArtSpinRate
    , albumArtWidth       : state => state.albumArtWidth
    , albumArtLoaded      : state => state.albumArtLoaded
    , albumArtZoomRate    : state => state.albumArtZoomRate
    , albumArtZoomWindow  : state => state.albumArtZoomWindow
    , albumArtZoomDisable : state => state.albumArtZoomDisable
    , triangleWidth       : state => state.triangleWidth
    , isLoadingImage      : state => state.isLoadingImage
    , ctx                 : state => state.ctx
    , sctx                : state => state.sctx
    , consoleIsOpen       : state => state.consoleIsOpen
    }
  , mutations:
    { updateSong(state, payload) {
        state.albumArt    = payload.albumArt
        state.songName    = payload.songName
        state.artistName  = payload.artistName
      }
    , updateToken(state, payload) {
        state.authToken = payload.authToken
      }
    , updateSongbpm(state, payload) {
        state.songbpm = payload.songbpm
      }
    , setAlbumArtSpinRate(state, payload) {
        state.albumArtSpinRate = payload
      }
    , rotateTriangles(state) {
        state.rotation += state.albumArtSpinRate
      }
    , resetTriangleRotation(state) {
        state.rotation = 0
      }
    , pulseAlbumArt(state) {
        if(state.albumArtZoomRate == 0) {
          state.albumArtWidth = state.triangleWidth * state.albumArtZoomWindow[0]
          return
        }

        state.albumArtWidth += (state.albumArtZoomIn) ? -state.albumArtZoomRate : state.albumArtZoomRate

        if(state.albumArtWidth < (state.triangleWidth * state.albumArtZoomWindow[0])) {
          state.albumArtZoomIn = false
        }
        else if(state.albumArtWidth > (state.triangleWidth * state.albumArtZoomWindow[1])) {
          state.albumArtZoomIn = true
        }
      }
    , setAlbumArtWidth(state, payload) {
        state.albumArtWidth = payload
      }
    , loadAlbumArt(state, payload) {
        state.albumArtLoaded = payload
      }
    , setContext(state, payload) {
        state.ctx = payload
      }
    , setStandardContext(state, payload) {
        state.sctx = payload
      }
    , setTriangleWidth(state, payload) {
        state.triangleWidth = payload
      }
    , setAlbumArtZoomRate(state, payload) {
        state.albumArtZoomRate = payload
      }
    , setAlbumArtZoomWindow(state, payload) {
        state.albumArtZoomWindow = payload
      }
    , hideConsole(state) {
        state.consoleIsOpen = false
      }
    , showConsole(state) {
        state.consoleIsOpen = true
      }
    , toggleConsole(state) {
        state.consoleIsOpen = !state.consoleIsOpen
      }
    , startLoadingImage(state) {
        state.isLoadingImage = true
      }
    , finishLoadingImage(state) {
        state.isLoadingImage = false
      }
    }
})

new Vue(
  { render: h => h(App)
  , store
  }
).$mount('#app')
