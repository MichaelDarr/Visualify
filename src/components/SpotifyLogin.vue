<template>
  <div class="login-page">
    <div class="inner">
      <h1>Welcome to Visualify.</h1>
      <div class="spacer"></div>
      <img @click="spotifyLogin()" class="spotify-login" src="SpotifyLogin.svg" />
    </div>
  </div>
</template>


<script>

export default
  { methods:
    { spotifyLogin: function() {

        var loginurl= process.env.VUE_APP_LOGIN_URL
          , proto   = process.env.VUE_APP_LOGIN_PROTO

        var spotifyURL = 'https://accounts.spotify.com/authorize?client_id=644406e4a44a430887b1a180181e897f&redirect_uri=' + proto + '%3A%2F%2F' + loginurl + '%2F&scope=user-read-currently-playing%20user-modify-playback-state&response_type=token&state=123'

        window.location.href = spotifyURL
      }
    }
  }

</script>
