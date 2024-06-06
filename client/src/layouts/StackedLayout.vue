<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const { links } = defineProps<{
  links: {
    label: string
    name: string
  }[]
}>()

const route = useRoute()

const navigation = computed(() =>
  links.map((item) => ({
    ...item,
    isActive: route.name === item.name,
  }))
)
const show = ref(false)
</script>

<template>
  <v-layout>
    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="show = !show"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>Welcome ...</v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="show">
      <v-list-item v-for="link in navigation" :key="link.name">{{ link.label }}</v-list-item>
    </v-navigation-drawer>
    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>
