<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref, watch, type Ref } from 'vue'
import CarouselComponent from '@/components/CarouselComponent.vue'
import CarouselSlide from '@/components/CarouselSlide.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import { mdiTooltipEdit } from '@mdi/js'
import { useRouter, useRoute } from 'vue-router'
import { checkIllustrationExpiration, createPages, handleError } from '@/utils/helpers'

const router = useRouter()
const errorMessage = ref()
const tale = ref()
const illustrationsRef = ref()
const route = useRoute()
const taleId = parseInt(route.params.id as string, 10)
const isFavorite: Ref<boolean> = ref(false)
const pages: Ref<string[]> = ref([])

const getIllustrations = handleError(trpc.illustration.find.query, errorMessage)
const illustrations = (await getIllustrations({ taleId })).filter((i: { isTemp: any }) => !i.isTemp)
illustrations
  .filter((i: { isTemp: any }) => !i.isTemp)
  .forEach(async (i: { createdAt: string; id: number }) => {
    if (!checkIllustrationExpiration(i.createdAt)) {
      const safeIllustrationDownload = handleError(trpc.illustration.download.query, errorMessage)
      await safeIllustrationDownload(i.id)
    }
  })

illustrationsRef.value = illustrations

watch(
  () => illustrationsRef.value,
  async () => {
    const safeGet = handleError(trpc.tale.get.query, errorMessage)
    tale.value = await safeGet(taleId)
    if (errorMessage.value === 'Tale was not found') router.push({ name: 'Not Found' })

    pages.value = createPages(tale.value)
  },
  { immediate: true }
)

const favorite = async (id: number) => {
  await trpc.tale.update.mutate({ taleId: id, isFavorite: true })
  isFavorite.value = true
}

const remove = async (id: number) => {
  try {
    await trpc.tale.remove.mutate(id)
    router.push({ name: 'StoryBook' })
  } catch (error) {
    errorMessage.value = 'Something went wrong while removing your tale from your story book'
  }
}
</script>
<template>
  <div class="main" v-if="tale">
    <div class="heading">
      <h1>{{ tale.title }}</h1>
      <v-icon :icon="mdiTooltipEdit" :size="30" @click="router.push(`/edit/${tale.id}`)"></v-icon>
    </div>
    <div class="content">
      <CarouselComponent v-slot="{ currentSlide }">
        <CarouselSlide v-for="(page, i) in pages" :key="i">
          <div class="page" v-show="i === currentSlide">
            <img v-if="i === 2 || i === 4" :src="page" width="100%" />
            <div v-else :class="{ title: i === 0 }">{{ page }}</div>
          </div>
        </CarouselSlide>
      </CarouselComponent>
      <ButtonPrimary
        v-show="!isFavorite"
        class="btn"
        text="Mark as Favorite"
        @click="() => favorite(tale.id)"
      />
      <ButtonPrimary class="btn" text="Delete" @click="() => remove(tale.id)" />
    </div>
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
  width: 100%;
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

@media (width >= 768px) {
  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .heading {
    justify-content: space-evenly;
  }

  .content {
    width: 650px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  img {
    width: 80%;
  }

  .page {
    display: flex;
    justify-content: center;
  }
}
</style>
