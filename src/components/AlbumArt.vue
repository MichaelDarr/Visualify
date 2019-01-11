<template>
  <div class="art-card" ref="artCard">
    <img :src="albumArt" class="album-art"/>
    <div class="info-box">
      <h1 v-show="songNameIsShort">{{ songName }}</h1>
      <h1 v-show="!songNameIsShort">
        <MarqueeText
          :key="songName"
          :repeat="4"
        >
          {{ songName }}
        </MarqueeText>
      </h1>

      <h2 v-show="artistNameIsShort">{{ artistName }}</h2>
      <h2 v-show="!artistNameIsShort">
        <MarqueeText
          :key="artistName"
          :repeat="4"
        >
          {{ artistName }}
        </MarqueeText>
      </h2>

      <div class="offscreen-test-text-length">
        <h1><span ref="songNameStatic">{{ songName }}</span></h1>
        <h2><span ref="artistNameStatic">{{ artistName }}</span></h2>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MarqueeText from 'vue-marquee-text-component'

export default
  { computed:
    { ...mapGetters(
        [ 'albumArt'
        , 'songName'
        , 'artistName'
        ]
      )
    }
  , components:
    { MarqueeText
    }
  , data() {
      return(
        { songNameIsShort: true
        , artistNameIsShort: true
        }
      )
    }
  , updated() {
      this.songNameIsShort    = (this.$refs.songNameStatic.offsetWidth <= this.$refs.artCard.offsetWidth)
      this.artistNameIsShort  = (this.$refs.artistNameStatic.offsetWidth <= this.$refs.artCard.offsetWidth)
    }
  }
</script>

<style scoped>

h1, h2 {
  white-space: nowrap;
}

.art-card {
  box-shadow: 0 19px 38px rgba(0,0,0,0.70), 0 15px 12px rgba(0,0,0,0.50);
  width: 20%;
  min-width: 20rem;
  margin-bottom: 20rem;
  margin-top: 5rem;
  position: relative;
  line-height: 0;
  z-index: 50;
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
  padding: 0;
  color: white;
  box-sizing: border-box;
}

.offscreen-test-text-length {
  position: absolute;
  visibility: hidden;
}

</style>
