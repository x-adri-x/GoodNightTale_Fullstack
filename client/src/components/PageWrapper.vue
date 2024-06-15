<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleError } from '@/utils/helpers'
import constants from '@/constants/constants'

const route = useRoute()
const errorMessage = ref()
const id = route.params.id as string

const safeGet = handleError(trpc.tale.get.query, errorMessage)
const tale = await safeGet(parseInt(id, 10))
const pages: string[] = []
pages.push(tale.title)
const tmpBody = tale.body.slice()
const urls = tale.illustrations.map((i: { url: any }) => i.url)
constants.illustrationIndexes.split(',').forEach((index, i) => {
  tmpBody.splice(parseInt(index, 10), 0, urls[i]!)
})
pages.push(...tmpBody)
</script>
<template>
  <div class="main">
    <slot :tale="tale" :illustrations="tale.illustrations" :pages="pages"></slot>
  </div>
</template>
<style scoped>
.main {
  padding: 2rem;
  width: 100%;
}
</style>
