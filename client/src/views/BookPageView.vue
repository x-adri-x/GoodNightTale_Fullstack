<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref } from 'vue'
import CarouselComponent from '@/components/CarouselComponent.vue'
import CarouselSlide from '@/components/CarouselSlide.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import { mdiTooltipEdit } from '@mdi/js'
import { useRouter, useRoute } from 'vue-router'
import { handleError } from '@/utils/helpers'
import constants from '@/constants/constants'

const router = useRouter()
const errorMessage = ref()
const tale = ref()
const route = useRoute()
const taleId = parseInt(route.params.id as string, 10)

const safeGet = handleError(trpc.tale.get.query, errorMessage)
tale.value = await safeGet(taleId)

const urls = tale.value.illustrations.map((i: { url: any }) => i.url)

const pages: string[] = []
pages.push(tale.value.title)
const tmpBody = tale.value.body.slice()

constants.illustrationIndexes.split(',').forEach((index, i) => {
  tmpBody.splice(parseInt(index, 10), 0, urls[i]!)
})
pages.push(...tmpBody)

const favorite = async (id: number) => {
  await trpc.tale.update.mutate({ taleId: id, isFavorite: true })
}
</script>
<template>
  <div class="main">
    <div class="heading">
      <h1>{{ tale.title }}</h1>
      <v-icon :icon="mdiTooltipEdit" :size="30" @click="router.push(`/edit/${tale.id}`)"></v-icon>
    </div>

    <CarouselComponent v-slot="{ currentSlide }">
      <CarouselSlide v-for="(page, i) in pages" :key="i">
        <div v-show="i === currentSlide">
          <img v-if="i === 2 || i === 4" :src="page" width="100%" alt="alt" />
          <div v-else :class="{ title: i === 0 }">{{ page }}</div>
        </div>
      </CarouselSlide>
    </CarouselComponent>
    <ButtonPrimary
      v-show="!tale.isFavorite"
      class="btn"
      text="Mark as Favorite"
      @click="() => favorite(tale.id)"
    />
  </div>
</template>
<style scoped>
.main {
  padding: 2rem;
  width: 100%;
}
.btn {
  margin-top: 40px;
  width: 100vw;
  height: 50px;
}
.heading {
  display: flex;
  justify-content: space-between;
}

h1 {
  font-size: x-large;
}

img {
  border-top-right-radius: 15%;
  border-bottom-right-radius: 15%;
}

.title {
  font-size: 1.3rem;
}
</style>
