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
import SpotifyLogin from './components/SpotifyLogin.vue'
import Visualizer from './components/Visualizer.vue'
import AlbumArt from './components/AlbumArt.vue'

import { mapGetters } from 'vuex'

var axios = require('axios')

export default
  { name      : 'app'
  , components:
    { SpotifyLogin
    , Visualizer
    , AlbumArt
    }
  , computed:
    { authToken:
      { get() { return this.$store.state.authToken }
      , set(v) { return this.$store.commit('updateToken', v) }
      }
    , ...mapGetters(
        [ 'songName'
        ]
      )
    }
  , created: async function() {

      window.addEventListener('keyup', this.keymonitor)

      var authToken = getTokenHash()
      window.location.hash = '';

      if(authToken) {
        this.$store.commit('updateToken', { authToken })

        // get song every 2 seconds
        setInterval(async function () {
          if(this.authToken) {
            var options =
              { method  : 'get'
              , url     : 'https://api.spotify.com/v1/me/player/currently-playing'
              , headers : { Authorization: 'Bearer ' + this.authToken }
              }

            var newSong = await axios(options)

            if(newSong.data && newSong.data.item && newSong.data.item.name !== this.songName) {
              this.$store.commit(
                { type: 'updateSong'
                , albumArt  : newSong.data.item.album.images[0].url
                , songName  : newSong.data.item.name
                , artistName: newSong.data.item.artists[0].name
                }
              )

              options.url = 'https://api.spotify.com/v1/audio-analysis/' + newSong.data.item.id

              var songDeets = await axios(options)

              this.$store.commit('updateSongbpm', songDeets.data.track.tempo)
            }

          }
        }.bind(this), 2000)

        // refresh token every 55 minutes, to be on the safe side
        setTimeout(function() {
          var spotifyURL = 'https://accounts.spotify.com/authorize?client_id=644406e4a44a430887b1a180181e897f&redirect_uri=https%3A%2F%2Fvisualify.live%2F&scope=user-read-currently-playing%20user-modify-playback-state&response_type=token&state=123'
          window.location.href = spotifyURL
        }, 60 * 55 * 1000)
      }
    }
  , methods: {
      keymonitor: function(event) {
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

function getTokenHash() {
    var url = window.location.href

    var regex = new RegExp('[?#]access_token(=([^&#]*)|&|#|$)')
      , results = regex.exec(url)

    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
</script>
