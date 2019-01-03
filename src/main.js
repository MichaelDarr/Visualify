import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store(
  { state:
    { albumArt      : null
    , songName      : null
    , artistName    : null
    , songbpm       : null
    , authToken     : null
    , rotation      : null
    , albumArtLoaded: null
    , ctx           : null
    }
  , getters:
    { albumArt        : state => state.albumArt
    , songName        : state => state.songName
    , artistName      : state => state.artistName
    , authToken       : state => state.authToken
    , songbpm         : state => state.songbpm
    , rotation        : state => state.rotation
    , albumArtLoaded  : state => state.albumArtLoaded
    , ctx             : state => state.ctx
    , sctx            : state => state.sctx
    , fctx            : state => state.fctx
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
        state.rotation += .001
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
    }
})

new Vue(
  { render: h => h(App)
  , store
  }
).$mount('#app')
