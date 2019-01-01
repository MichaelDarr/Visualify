<template>
  <div class="canvasHolder">
    <canvas ref="visualizerCanvas">
      <Triangle ref="triangles">
      </Triangle>
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
      return { provider: { context: null } }
    }
  , provide() {
      return { provider: this.provider }
    }
  , created() {
      // rotate the triangles
      setInterval(async function() {
        this.$store.commit('rotateTriangles')

        if(this.$refs.triangles) {
          this.$refs.triangles.spin()
        }
      }.bind(this), 50)
    }
  , mounted() {
      // We can't access the rendering context until the canvas is mounted to the DOM.
      // Once we have it, provide it to all child components.
      this.provider.context = this.$refs['visualizerCanvas'].getContext('2d')

      this.$store.commit('setContext', this.provider.context)

      // Resize the canvas to fit its parent's width.
      // Normally you'd use a more flexible resize system.
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

</style>
