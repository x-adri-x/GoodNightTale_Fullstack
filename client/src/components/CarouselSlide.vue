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
</style>
