<template>
  <div>
    <p class="slider-label">{{controlTitle}}</p>
    <p
      class="slider-option-arrow"
      ref="spin-rate-option-arrow"
      v-on:click="toggleSpinRateControls"
      >
      {{this.spinRateControlsExpanded ? "&#9660;" : "&#9654;"}}
    </p>
    <transition
      v-on:enter="enter"
      v-on:leave="leave"
    >
      <div v-if="spinRateControlsExpanded">
        <div class="customization-detail-holder">
          <div class="customization-slider-holder">
            <vue-slider
              v-model="sliderVariableFinal"
              v-bind="sliderOptions"
            ></vue-slider>
          </div>
          <div class="customization-button-holder">
            <div v-if="disableFunction">
              <div><p class="modify-slider-button" v-on:click="resetFunction">reset</p></div>
              <div class="modify-slider-button-spacer"></div>
              <div><p class="modify-slider-button" v-on:click="disableFunction">disable</p></div>
            </div>
            <div v-else>
              <div class="no-disable-spacer"></div>
              <div><p class="modify-slider-button" v-on:click="resetFunction">reset</p></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

import vueSlider from 'vue-slider-component'
import Velocity from 'velocity-animate'

export default
{ props:
  { controlTitle    : String
  , sliderGet       : Function
  , sliderSet       : Function
  , sliderOptions   : Object
  , resetFunction   : Function
  , disableFunction : Function
  }
, data() {
    return(
      { spinRateControlsExpanded: false
      }
    )
  }
, computed:
  { sliderVariableFinal:
    { get() {
        return this.sliderGet()
      }
    , set(newVal) {
        this.sliderSet(newVal)
      }
    }
  }
, components:
  { vueSlider
  }
, methods:
  { toggleSpinRateControls: function() {
      this.spinRateControlsExpanded = !this.spinRateControlsExpanded
    }
  , enter: function (el, done) {
      Velocity(el, "slideDown", { duration: 300 }, {complete: done})
    }
  , leave: function (el, done) {
      Velocity(el, "slideUp", { duration: 300 }, {complete: done})
    }
  }
}

</script>

<style scoped>

.slider-label {
  display: inline-block;
  margin: 0 0 10px 0;
  font-size: 0.9rem;
}

.slider-option-arrow {
  position: relative;
  margin: 0;
  font-size: 0.8rem;
  display: inline-block;
  cursor: pointer;
  float: right;
  margin: 1px 0 0 0;
}

.slider-option-arrow:hover {
  color: #c3c3c3;
  text-shadow: 0 0 2px white;
}

.slider-label-text {
  margin-top: 5px;
}

.modify-slider-button {
  display: inline-block;
  font-size: .7rem;
  cursor: pointer;
  background-color: #282828;
  border-radius: 20px;
  padding: 5px 10px 5px 10px;
  margin: 0 0 5px 0;
  color: #b3b3b3;
  float: right;
}

.modify-slider-button-spacer {
  height: 15px;
}

.no-disable-spacer {
  height: 30px;
}

.customization-detail-holder {
  display: flex;
  margin-bottom: 20px;
}

.customization-slider-holder {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  padding-bottom: 7px;
}


</style>
