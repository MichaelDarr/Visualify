<template>
  <div class="helper-body">
    <p class="helper-text">
      Press <span class="key" v-on:click="openConsole">C</span> to see controls and more options!<span class="close-helper" v-on:click="closeHelper">&#10005;</span>
    </p>
  </div>
</template>

<script>

export default
{ methods:
  { openConsole: function() {
      var evt = new KeyboardEvent('keyup', {code: 'KeyC'})
      window.dispatchEvent(evt)
    }
  , closeHelper: function() {
      this.$store.commit('disableHelper');
    }
  }
}

</script>

<style scoped>

.helper-body {
  position: absolute;
  margin: 0 auto;
  bottom: 40px;
  background-color: #282828;
  border-radius: 50px;
  color: white;
  padding: 5px 20px 5px 20px;
}

.key {
  display: inline-block;
  font-family: monospace;
  font-size: .9rem;
  background-color: white;
  border-radius: 10px;
  padding: 2px 8px 3px 8px;
  margin: 0 5px 0 5px;
  color: #282828;
  cursor: pointer;
  transition: all 0.2s ease;
  vertical-align:text-bottom;
}

.key:hover {
  background-color: #cfcfcf;
}

.close-helper {
  margin-left: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-helper:hover {
  color: #c3c3c3;
  text-shadow: 0 0 2px white;
}

</style>
