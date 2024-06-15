<script setup lang="ts">
import StackedLayout from './StackedLayout.vue'

const links = [
  { label: 'Home', name: 'Home' },
  { label: 'Storybook', name: 'StoryBook' },
  { label: 'Logout', name: 'Logout' },
]
</script>

<template>
  <StackedLayout :links="links" />
</template>
