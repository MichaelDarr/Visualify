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
