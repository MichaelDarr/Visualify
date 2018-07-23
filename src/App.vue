<template>
  <div id="app">
    <div v-if="curPlaying" class="art-container">
      <div class="art-card">
        <img :src="albumArt" class="album-art"/>
        <div class="info-box">
          <h1>{{ songName }}</h1>
          <h2>{{ artistName }}</h2>
        </div>
      </div>
    </div>
    <SpotifyLogin v-else/>
    <p id="geoHelper" class="hidden-helper">{{albumArt}}</p>
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

      if(token) {
        this.authToken = token

        var options =
          { method  : 'get'
          , url     : 'https://api.spotify.com/v1/me/player/currently-playing'
          , headers : { Authorization: 'Bearer ' + token }
          }

        var curSong = await axios(options)

        this.curPlaying = curSong.data
      }

      setInterval(async function () {
        if(this.authToken) {
          var options =
            { method  : 'get'
            , url     : 'https://api.spotify.com/v1/me/player/currently-playing'
            , headers : { Authorization: 'Bearer ' + this.authToken }
            }

          var curSong = await axios(options)

          this.curPlaying = curSong.data
        }
      }.bind(this), 100)

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
