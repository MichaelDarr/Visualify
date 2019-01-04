import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store(
  { state:
    { albumArt          : null
    , songName          : null
    , artistName        : null
    , songbpm           : null
    , authToken         : null
    , rotation          : null
    , albumArtSpinRate  : .2
    , albumArtZoomRate  : .05
    , albumArtZoomCeil  : 2
    , albumArtZoomFloor : .5
    , albumArtZoomIn    : true
    , albumArtWidth     : 20
    , albumArtLoaded    : null
    , triangleWidth     : 20
    , ctx               : null
    }
  , getters:
    { albumArt          : state => state.albumArt
    , songName          : state => state.songName
    , artistName        : state => state.artistName
    , authToken         : state => state.authToken
    , songbpm           : state => state.songbpm
    , rotation          : state => state.rotation
    , albumArtSpinRate  : state => state.albumArtZoomRate
    , albumArtWidth     : state => state.albumArtWidth
    , albumArtLoaded    : state => state.albumArtLoaded
    , triangleWidth     : state => state.triangleWidth
    , ctx               : state => state.ctx
    , sctx              : state => state.sctx
    , fctx              : state => state.fctx
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
    , rotateTriangles(state) {
        state.rotation += state.albumArtSpinRate
      }
    , pulseAlbumArt(state) {
        state.albumArtWidth += (state.albumArtZoomIn) ? state.albumArtZoomRate : -state.albumArtZoomRate

        if(state.albumArtWidth > (state.triangleWidth * state.albumArtZoomCeil) || state.albumArtWidth < (state.triangleWidth * state.albumArtZoomFloor)) {
          state.albumArtZoomIn = !state.albumArtZoomIn
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
    , setFlippedContext(state, payload) {
        state.fctx = payload
      }
    , setTriangleWidth(state, payload) {
        state.triangleWidth = payload
      }
    }
})

new Vue(
  { render: h => h(App)
  , store
  }
).$mount('#app')
