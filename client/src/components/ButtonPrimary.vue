<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  text: {
    type: String,
    required: true,
  },
  isDisabled: {
    type: Boolean,
    required: false,
  },
})
</script>
<template>
  <v-btn variant="tonal" class="rounded-lg" :disabled="isDisabled">{{ text }}</v-btn>
</template>
