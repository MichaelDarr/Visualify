<template>
  <div id="app">
    <div v-if="authToken" class="art-container">
      <AlbumArt v-if="songName"/>
      <template v-else>
        <div class="art-card">
          <div class="info-box">
            <h1>Loading...</h1>
          </div>
        </div>
      </template>
      <Visualizer />
    </div>
    <SpotifyLogin v-else/>
  </div>
</template>

<script>
// custom componenets
import SpotifyLogin from './components/SpotifyLogin.vue'
import Visualizer from './components/Visualizer.vue'
import AlbumArt from './components/AlbumArt.vue'

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
  }
, computed:
  { ...mapGetters(
      [ 'songName'
      , 'authToken'
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

      // poll for new song every 2 seconds
      setInterval(async function () {
        if(this.authToken) {
          var options =
            { method  : 'get'
            , url     : 'https://api.spotify.com/v1/me/player/currently-playing'
            , headers : { Authorization: 'Bearer ' + this.authToken }
            }

          var newSong = await axios(options)

          // if there is a song, and it's not the same as the last poll, update the store with new info
          if(newSong.data && newSong.data.item && newSong.data.item.name !== this.songName) {
            this.$store.commit(
              { type      : 'updateSong'
              , albumArt  : newSong.data.item.album.images[0].url
              , songName  : newSong.data.item.name
              , artistName: newSong.data.item.artists[0].name
              }
            )

            // for the new song, get further details. Right now, only storing the BPM
            options.url = 'https://api.spotify.com/v1/audio-analysis/' + newSong.data.item.id
            var songDeets = await axios(options)
            if(songDeets && songDeets.data) {
              this.$store.commit('updateSongbpm', songDeets.data.track.tempo)
            }
          }

        }
      }.bind(this), 5000)

      // refresh token every 55 minutes, to be on the safe side
      // basically, this just sends the browser back to the spotify redirect link.
      // if the user has already authenticated the app (they have), the redirect goes
      // straight back to this website, where the token is detected and they go
      // right back to the visualizer, without pressing any buttons or intervening.
      setTimeout(function() {
        var spotifyURL = 'https://accounts.spotify.com/authorize?client_id=644406e4a44a430887b1a180181e897f&redirect_uri=https%3A%2F%2Fvisualify.live%2F&scope=user-read-currently-playing%20user-modify-playback-state&response_type=token&state=123'
        window.location.href = spotifyURL
      }, 60 * 55 * 1000)
    }
  }
, methods: {
    // handles all keypresses
    keymonitor: function(event) {
      // pressing the spacebar pauses/unpauses the song via the spotify API
      if(event.code === "Space") {
        if(this.isPaused) {
          this.isPaused = false

          axios(
            { method  : 'put'
            , url     : 'https://api.spotify.com/v1/me/player/play'
            , headers : { Authorization: 'Bearer ' + this.authToken }
            }
          )
        }
        else {
          this.isPaused = true

          axios(
            { method  : 'put'
            , url     : 'https://api.spotify.com/v1/me/player/pause'
            , headers : { Authorization: 'Bearer ' + this.authToken }
            }
          )
        }
      }
      // left and right buttons go back/forward in song queue
      else if(event.code === 'ArrowRight') {
        axios(
          { method  : 'post'
          , url     : 'https://api.spotify.com/v1/me/player/next'
          , headers : { Authorization: 'Bearer ' + this.authToken }
          }
        )
      }
      else if(event.code === 'ArrowLeft') {
        axios(
          { method  : 'post'
          , url     : 'https://api.spotify.com/v1/me/player/previous'
          , headers : { Authorization: 'Bearer ' + this.authToken }
          }
        )
      }
      else if(event.code === 'KeyP') {
        this.pEnabled = !this.pEnabled
      }
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
  font-family: 'Raleway', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
