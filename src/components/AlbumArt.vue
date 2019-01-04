<template>
  <div class="art-card">
    <img :src="albumArt" class="album-art"/>
    <div class="info-box">
      <h1>{{ songName }}</h1>
      <h2>{{ artistName }}</h2>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default
  { computed:
    { ...mapGetters(
        [ 'albumArt'
        , 'songName'
        , 'artistName'
        ]
      )
    }
  }
</script>

<style scoped>

.art-card {
  box-shadow: 0 19px 38px rgba(0,0,0,0.70), 0 15px 12px rgba(0,0,0,0.50);
  width: 20%;
  min-width: 20rem;
  margin-bottom: 20rem;
  margin-top: 5rem;
  position: relative;
  line-height: 0;
  z-index: 100;
}

.album-art {
  width: 100%;
}

.info-box {
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  line-height: normal;
  padding-left: 10px;
  color: white;
  box-sizing: border-box;
}

</style>
