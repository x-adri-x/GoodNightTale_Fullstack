<script setup lang="ts">
import { defineProps, type PropType } from 'vue'

type Variant = 'info' | 'warning' | 'error'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    required: true,
  },
  variant: {
    type: String as PropType<Variant>,
    required: true,
  },
})
const icon = '$'.concat(props.variant)
</script>
<template>
  <v-alert :color="variant" :icon="icon" :title="title" :text="text"></v-alert>
</template>
