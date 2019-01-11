<template>
  <div class="login-page">
    <div class="centered-login">
      <h1>Visualify</h1>
      <h2>Your live spotify stream, visualized.</h2>
      <div class="spacer"></div>
      <img @click="spotifyLogin()" class="spotify-login" src="SpotifyLogin.svg" />
    </div>
    <div class="credit-footer">
      <p>&#169; 2019 Michael Darr</p>
    </div>
  </div>
</template>


<script>

export default
  { methods:
    { spotifyLogin: function() {

        // grab the redirect url info from an env file - this is mostly for enabling local dev
        var loginurl  = process.env.VUE_APP_LOGIN_URL
          , proto     = process.env.VUE_APP_LOGIN_PROTO
          , urlOne    = process.env.VUE_APP_SPOTIFY_LINK_PART_ONE
          , urlTwo    = process.env.VUE_APP_SPOTIFY_LINK_PART_TWO

        // build url and redirect
        var spotifyURL = urlOne + proto + '%3A%2F%2F' + loginurl + urlTwo
        window.location.href = spotifyURL
      }
    }
  }

</script>

<style scoped>

h1 {
  font-size: 4rem;
  margin-bottom: 0;
}

.login-page {
  width: 100%;
  height: 100vh;
  font-family: 'Comfortaa', cursive;
  display: flex;
  align-items: center;
  justify-content: center;
}

.centered-login {
  text-align: center;
}

.spacer {
  height: 20vh;
}

.spotify-login {
  width: 300px;
  cursor: pointer;
  margin-bottom: 20vh;
}

.credit-footer {
  position: absolute;
  bottom: 0;
  right: 0;
  padding-right: 10px;
}

</style>
