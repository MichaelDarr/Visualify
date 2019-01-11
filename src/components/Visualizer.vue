<template>
  <div class="canvasHolder">
    <canvas ref="visualizerCanvas" class="visualizerCanvas">
      <TriangleTesselation ref="triangles">
      </TriangleTesselation>
    </canvas>
    <canvas ref="standardCanvas" class="hiddenCanvas">
    </canvas>
  </div>
</template>


<script>
import TriangleTesselation from './TriangleTesselation.vue'

export default
  { components:
    { TriangleTesselation
    }
  , mounted() {

      // load canvases into vuex store
      this.$store.commit('setContext', this.$refs['visualizerCanvas'].getContext('2d'))
      this.$store.commit('setStandardContext', this.$refs['standardCanvas'].getContext('2d'))

      // set the dimensions of the main canvas to that of its parent - in this case, the who screen
      this.$refs['visualizerCanvas'].width = this.$refs['visualizerCanvas'].parentElement.clientWidth
      this.$refs['visualizerCanvas'].height = this.$refs['visualizerCanvas'].parentElement.clientHeight

      this.$store.commit('loadLocalStorage')
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
