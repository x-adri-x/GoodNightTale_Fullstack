<script setup lang="ts">
import { ref } from 'vue'
import PageWrapper from '@/components/PageWrapper.vue'

const title = ref()
</script>
<template>
  <PageWrapper>
    <template v-slot="props">
      <v-text-field
        v-model="title"
        theme="primary-darken-1"
        :rules="[(value) => value.length >= 5]"
        :label="props.tale.title"
      ></v-text-field>
      <p v-for="illustration in props.illustrations" :key="illustration.id">
        {{ illustration.prompt }}
      </p>
    </template>
  </PageWrapper>
</template>
