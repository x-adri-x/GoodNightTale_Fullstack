<script setup lang="ts"></script>
<template>
  <div class="slide">
    <Transition name="slide">
      <slot></slot>
    </Transition>
  </div>
</template>
<style scoped>
.slide {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.slide-enter-active {
  /* transition: opacity 0.8s ease-in-out; */
  transition: opacity 0.8s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
.slide-leave-from,
.slide-enter-to {
  opacity: 1;
}
</style>
