<template>
  <div class="canvasHolder">
    <canvas ref="visualizerCanvas" class="visualizerCanvas">
      <Triangle ref="triangles">
      </Triangle>
    </canvas>
    <canvas ref="standardCanvas" class="hiddenCanvas">
    </canvas>
    <canvas ref="flippedCanvas" class="hiddenCanvas">
    </canvas>
  </div>
</template>


<script>
import Triangle from './Triangle.vue'
import { mapGetters } from 'vuex'

export default
  { computed:
    { ...mapGetters(
        [
        ]
      )
    }
  , components:
    { Triangle
    }
  , data() {
      return (
        { provider          : {context: null}
        , standardProvider  : {context: null}
        , flippedProvider   : {context: null}
        }
      )
    }
  , provide() {
      return (
        { provider          : this.provider
        , standardProvider  : this.standardProvider
        , flippedProvider   : this.flippedProvider
        }
      )
    }
  , mounted() {
      this.provider.context         = this.$refs['visualizerCanvas'].getContext('2d')
      this.standardProvider.context = this.$refs['standardCanvas'].getContext('2d')
      this.flippedProvider.context  = this.$refs['flippedCanvas'].getContext('2d')

      this.$store.commit('setContext', this.provider.context)
      this.$store.commit('setStandardContext', this.standardProvider.context)
      this.$store.commit('setFlippedContext', this.flippedProvider.context)

      this.$refs['visualizerCanvas'].width = this.$refs['visualizerCanvas'].parentElement.clientWidth
      this.$refs['visualizerCanvas'].height = this.$refs['visualizerCanvas'].parentElement.clientHeight
    }
  }
</script>


<style scoped>

.canvasHolder {
  position    : absolute;
  width       : 100%;
  height      : 100%;
  z-index     : -1;
}

.hiddenCanvas {
  visibility: hidden;
}

</style>
