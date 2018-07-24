<template>
  <div id="app">
    <div v-if="authToken" class="art-container">
      <template v-if="curPlaying">
        <div class="art-card">
          <img :src="albumArt" class="album-art"/>
          <div class="info-box">
            <h1>{{ songName }}</h1>
            <h2>{{ artistName }}</h2>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="art-card">
          <div class="info-box">
            <h1>No Song Playing!</h1>
          </div>
        </div>
      </template>
    </div>
    <SpotifyLogin v-else/>
    <p id="geoHelper" class="hidden-helper">{{albumArt}}</p>
    <p id="bpmHelper" class="hidden-helper">{{bpm}}</p>
  </div>
</template>

<script>
import SpotifyLogin from './components/SpotifyLogin.vue'

var axios = require('axios')

export default
  { name      : 'app'
  , components:
    { SpotifyLogin
    }
  , data() {
    return(
      { authToken : null
      , curPlaying: null
      , songId    : null
      , bpm       : null
      }
    )
  }
  , computed  :
    { songName   : function() {
        if(!this.curPlaying) return null
        return this.curPlaying.item.name
      }
    , artistName : function() {
        if(!this.curPlaying) return null
        return this.curPlaying.item.artists[0].name
      }
    , albumArt : function() {
        if(!this.curPlaying) return null
        return this.curPlaying.item.album.images[0].url
      }
    }
  , created   : async function() {
      var token = getTokenHash()
      window.location.hash = '';

      if(token) {
        this.authToken = token

        setInterval(async function () {
          if(this.authToken) {
            var options =
              { method  : 'get'
              , url     : 'https://api.spotify.com/v1/me/player/currently-playing'
              , headers : { Authorization: 'Bearer ' + this.authToken }
              }

            var curSong = await axios(options)

            if(this.songId === null || curSong.data.item.name !== this.curPlaying.item.name) {
              this.songId = curSong.data.item.id
              var newBPM = await updateBPM(curSong.data.item.id, this.authToken)

              this.bpm = newBPM

              console.log(this.bpm)
            }

            this.curPlaying = curSong.data

          }
        }.bind(this), 1000)
      }

    }
  }

async function updateBPM(songId, token) {
  var options =
    { method  : 'get'
    , url     : '	https://api.spotify.com/v1/audio-analysis/' + songId
    , headers : { Authorization: 'Bearer ' + token }
    }

  var songDeets = await axios(options)

  return songDeets.data.track.tempo
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
