<template>
  <div id="app">
    <div v-if="authToken" class="art-container">
      <transition name="slide">
        <Console v-if="consoleIsOpen" />
      </transition>
      <template v-if="songName">
        <transition name="fade">
          <AlbumArt v-if="artCardIsActive"/>
        </transition>
      </template>
      <template v-else>
        <div class="loading-card">
          <div class="info-box">
            <h1 v-if="songIsPlaying">Loading...</h1>
            <h1 v-else>No song detected - play something on Spotify!</h1>
          </div>
        </div>
      </template>
      <Visualizer />
      <transition name="fade">
        <ControlHelper v-if="helperIsActive"/>
      </transition>
    </div>
    <SpotifyLogin v-else/>
  </div>
</template>

<script>
// custom componenets
import SpotifyLogin from './components/SpotifyLogin.vue'
import Visualizer from './components/Visualizer.vue'
import AlbumArt from './components/AlbumArt.vue'
import Console from './components/Console.vue'
import ControlHelper from './components/ControlHelper.vue'

// maps vuex getters to simple this.{x} variables see ...mapGetters
import { mapGetters } from 'vuex'

// this library helps simplify http requests
var axios = require('axios')

export default
{ name      : 'app'
, components:
  { SpotifyLogin
  , Visualizer
  , AlbumArt
  , ControlHelper
  , Console
  }
, computed:
  { ...mapGetters(
      [ 'songName'
      , 'authToken'
      , 'consoleIsOpen'
      , 'playbackIsMuted'
      , 'volumeCache'
      , 'songIsPlaying'
      , 'helperIsActive'
      , 'songIsPaused'
      , 'artCardIsActive'
      ]
    )
  }
, created: async function() {

    // start listening for key events, all handled below
    window.addEventListener('keyup', this.keymonitor)

    // fetch the access token from the url (redirected from spotify) and clear it
    var authToken = getTokenHash()
    window.location.hash = '';

    // if there is a token, store it in the vuex store and start polling for song data
    if(authToken) {
      this.$store.commit('updateToken', { authToken })

      // poll for new song every 5 seconds
      this.startInterval(async function () {
        if(this.authToken) {

          var newSong = await this.makeSpotifyRequest('get', 'v1/me/player/currently-playing')

          // if there is a song, and it's not the same as the last poll, update the store with new info
          if(newSong.data && newSong.data.item && newSong.data.item.name !== this.songName) {
            this.$store.commit('setSongIsPlaying', true)
            this.$store.commit(
              { type      : 'updateSong'
              , albumArt  : newSong.data.item.album.images[0].url
              , songName  : newSong.data.item.name
              , artistName: newSong.data.item.artists[0].name
              }
            )

            // for the new song, get further details. Right now, only storing the BPM
            var songDeets = await this.makeSpotifyRequest('get', 'v1/audio-analysis/' + newSong.data.item.id)
            if(songDeets && songDeets.data) {
              this.$store.commit('updateSongbpm', songDeets.data.track.tempo)
            }
          }
          else {
            this.$store.commit('setSongIsPlaying', false)
          }

        }
      }.bind(this), 5)

      // refresh token every 60 minutes
      // basically, this just sends the browser back to the spotify redirect link.
      // if the user has already authenticated the app (they have), the redirect goes
      // straight back to this website, where the token is detected and they go
      // right back to the visualizer, without pressing any buttons or intervening.
      setTimeout(function() {

        // grab the redirect url info from an env file - this is mostly for enabling local dev
        var loginurl  = process.env.VUE_APP_LOGIN_URL
          , proto     = process.env.VUE_APP_LOGIN_PROTO
          , urlOne    = process.env.VUE_APP_SPOTIFY_LINK_PART_ONE
          , urlTwo    = process.env.VUE_APP_SPOTIFY_LINK_PART_TWO

        // build url and redirect
        var spotifyURL = urlOne + proto + '%3A%2F%2F' + loginurl + urlTwo
        window.location.href = spotifyURL
      }, 60 * 60 * 1000)

      // get intial song pause state
      var songIsPausedDetails = await this.makeSpotifyRequest('get', 'v1/me/player')
      this.$store.commit('setSongIsPaused', !songIsPausedDetails.data.is_playing)

    }
  }
, methods:
  { makeSpotifyRequest: async function(method, path) {
      return axios(
        { method  : method
        , url     : 'https://api.spotify.com/' + path
        , headers : { Authorization: 'Bearer ' + this.authToken }
        }
      )
    }
    // handles all keypresses
  , keymonitor: async function(event) {
      switch(event.code) {
        // pressing the spacebar pauses/unpauses the song via the spotify API
        case 'Space':

          if(this.songIsPaused) {
            this.$store.commit('setSongIsPaused', false)
            this.makeSpotifyRequest('put', 'v1/me/player/play')
          }
          else {
            this.$store.commit('setSongIsPaused', true)
            this.makeSpotifyRequest('put', 'v1/me/player/pause')
          }
          break;

        // left and right buttons go back/forward in song queue
        case 'ArrowRight':
          this.makeSpotifyRequest('post', 'v1/me/player/next')
          break;
        case 'ArrowLeft':
          this.makeSpotifyRequest('post', 'v1/me/player/previous')
          break;

        // raise and lower volume
        case 'ArrowUp':
          var volumeDetailsUp = await this.makeSpotifyRequest('get', 'v1/me/player')

          var finalVolumeUp = volumeDetailsUp.data.device.volume_percent + 10;
          if(finalVolumeUp > 100) finalVolumeUp = 100
          this.makeSpotifyRequest('put', 'v1/me/player/volume?volume_percent=' + finalVolumeUp)
          break;
        case 'ArrowDown':
          var volumeDetailsDown = await this.makeSpotifyRequest('get', 'v1/me/player')

          var finalVolumeDown = volumeDetailsDown.data.device.volume_percent - 10;
          if(finalVolumeDown < 0) finalVolumeDown = 0
          this.makeSpotifyRequest('put', 'v1/me/player/volume?volume_percent=' + finalVolumeDown)
          break;

        // control console toggled on/off
        case 'KeyC':
          this.$store.commit('toggleConsole')
          this.$store.commit('disableHelper')
          break;

        // mute playback
        case 'KeyM':

          if(this.playbackIsMuted) {
            this.$store.commit('toggleMutedState')
            this.makeSpotifyRequest('put', 'v1/me/player/volume?volume_percent=' + this.volumeCache)
          }
          else {
            var volumeDetails = await this.makeSpotifyRequest('get', 'v1/me/player')
            this.$store.commit('setVolumeCache', volumeDetails.data.device.volume_percent)
            this.$store.commit('toggleMutedState')
            this.makeSpotifyRequest('put', 'v1/me/player/volume?volume_percent=0')
          }

          break;

        // fullscreen
        case 'KeyF':
          if(window.innerHeight >= screen.height - 1) {
            document.exitFullscreen()
          }
          else {
            this.$el.requestFullscreen()
          }
          break;

        // (dis)able art card
        case 'KeyA':
          this.$store.commit('toggleArtCardIsActive')
          break;
      }
    }
  , startInterval: function(callback, seconds) {
      callback();
      return setInterval(callback, seconds * 1000);
    }
  }
}

// pulls spotify access token from the URL upon redirect
function getTokenHash() {
    var url = window.location.href

    var regex = new RegExp('[?#]access_token(=([^&#]*)|&|#|$)')
      , results = regex.exec(url)

    // 2 failsafes for non-standard results, one return for successful retrieval
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
</script>

<style scoped>

.art-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-enter-active {
  transition: all .2s ease-in-out;
}
.slide-leave-active {
  transition: all .2s ease-in-out;
}
.slide-enter, .slide-leave-to{
  transform: translateX(-300px);
}

.loading-card {
  box-shadow: 0 19px 38px rgba(0,0,0,0.70), 0 15px 12px rgba(0,0,0,0.50);
  width: 40%;
  min-width: 20rem;
  margin-bottom: 20rem;
  margin-top: 10rem;
  position: relative;
  line-height: 0;
  z-index: 50;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
