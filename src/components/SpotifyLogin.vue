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

        //var spotifyURL = 'https://accounts.spotify.com/authorize?client_id=644406e4a44a430887b1a180181e897f&redirect_uri=https%3A%2F%2Fvisualify.live%2F&scope=user-read-currently-playing&response_type=token&state=123'
        var spotifyURL = 'https://accounts.spotify.com/authorize?client_id=644406e4a44a430887b1a180181e897f&redirect_uri=http%3A%2F%2Flocalhost%3A8080&scope=user-read-currently-playing&response_type=token&state=123'

        window.location.href = spotifyURL
      }
    }
  }

</script>
