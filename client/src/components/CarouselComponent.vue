<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mdiChevronRight, mdiChevronLeft } from '@mdi/js'

const currentSlide = ref(0)
const getSlideCount = ref(0)

const moveForward = () => {
  if (currentSlide.value === getSlideCount.value) {
    return
  }
  currentSlide.value += 1
}
const moveBack = () => {
  if (currentSlide.value === 0) {
    return
  }
  currentSlide.value -= 1
}
onMounted(() => {
  getSlideCount.value = document.querySelectorAll('.slide').length - 1
})
</script>
<template>
  <div class="carousel">
    <slot :currentSlide="currentSlide" />
    <div class="navigation">
      <div class="toggle left" @click="moveBack()" @keyup="moveBack()">
        <v-icon :icon="mdiChevronLeft" :size="30" :class="{ dim: currentSlide === 0 }"></v-icon>
      </div>
      <div class="toggle right" @click="moveForward()" @keyup="moveForward()">
        <v-icon
          :icon="mdiChevronRight"
          :size="30"
          :class="{ dim: currentSlide === getSlideCount }"
        ></v-icon>
      </div>
    </div>
  </div>
</template>
<style scoped>
.carousel {
  position: relative;
  max-height: 500px;
  height: 50vh;
}
.navigation {
  padding: 0px 10px;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.dim {
  background-color: rgba(235, 235, 235, 0.24);
}
.toggle {
  display: flex;
  flex: 1;
}
.right {
  justify-content: flex-end;
}

i {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(235, 235, 235, 0.64);
  color: #181818;
  border-radius: 50%;
}
</style>
