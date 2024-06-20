<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { logout } from '@/stores/user'

const { links } = defineProps<{
  links: {
    label: string
    name: string
  }[]
}>()

const route = useRoute()
const router = useRouter()
const show = ref(window.innerWidth > 768 ? true : false)
const navigation = computed(() =>
  links.map((item) => ({
    ...item,
    isActive: route.name === item.name,
  }))
)

function logoutUser() {
  logout()
  router.push({ name: 'Landing' })
}

const handleClick = (name: string) => {
  if (name === 'Logout') {
    logoutUser()
  } else {
    router.push({ name: `${name}` })
  }
}
</script>

<template>
  <v-layout>
    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="show = !show"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>Good Night Tale</v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="show">
      <v-list-item
        v-for="link in navigation"
        :key="link.name"
        @click="() => handleClick(link.name)"
        >{{ link.label }}</v-list-item
      >
    </v-navigation-drawer>
    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>
