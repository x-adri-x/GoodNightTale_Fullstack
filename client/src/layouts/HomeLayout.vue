<script setup lang="ts">
import StackedLayout from './StackedLayout.vue'

const links = [
  { label: 'Login', name: 'Login' },
  { label: 'Signup', name: 'Signup' },
  { label: 'Storybook', name: 'StoryBook' },
]
</script>

<template>
  <StackedLayout :links="links" />
</template>
