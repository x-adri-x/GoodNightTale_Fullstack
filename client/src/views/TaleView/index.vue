<script setup lang="ts">
import { trpc } from '@/trpc'
import { watch, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useTaleStore from '@/stores/tale'
import AlertToast from '@/components/AlertToast.vue'
import CarouselComponent from '@/components/CarouselComponent.vue'
import CarouselSlide from '@/components/CarouselSlide.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import { createPages, handleError, checkIllustrationExpiration } from '@/utils/helpers'

const networkErrorTitle = 'Network request error.'
const networkErrorMessage =
  'Something went wrong when trying to generate your tale. Please check your connection and try again.'
const illustrationRequestErrorMessage =
  'Something went wrong when trying to generate images for your tale.'

const route = useRoute()
const router = useRouter()
const taleStore = useTaleStore()
const pages = ref()
const errorMessage = ref()
const isSaved = ref()
const taleId = computed(() =>
  parseInt(route.query.id as string, 10) ? parseInt(route.query.id as string, 10) : taleStore.id
)

if (!taleStore.generationInProgress) {
  const getTale = handleError(trpc.tale.get.query, errorMessage)
  const tale = await getTale(taleId.value)
  isSaved.value = tale.isSaved
  const illustrationsData = tale.illustrations.map((i: { id: any; createdAt: any }) => ({
    id: i.id,
    createdAt: i.createdAt,
  }))
  illustrationsData.map(async (data: { createdAt: string; id: any }) => {
    if (!checkIllustrationExpiration(data.createdAt)) {
      const safeIllustrationDownload = handleError(trpc.illustration.download.query, errorMessage)
      await safeIllustrationDownload(data.id)
    }
  })
  pages.value = createPages(tale)
}

watch(
  () => taleStore.id,
  async () => {
    router.push({
      query: {
        id: taleStore.id,
      },
    })
    const safeTaleGet = handleError(trpc.tale.get.query, errorMessage)
    const tale = await safeTaleGet(taleStore.id)
    const illustrationIds = tale.illustrations.map((i: { id: any }) => i.id)
    try {
      await trpc.openai.visual.mutate({ taleId: taleStore.id!, illustrationIds })
      const uploadPromises = tale.illustrations.map((i: { id: any }) =>
        trpc.illustration.upload.mutate({ taleId: taleStore.id!, id: i.id })
      )
      await Promise.all(uploadPromises)
      const downloadPromises = tale.illustrations.map((i: { id: any }) =>
        trpc.illustration.download.query(i.id)
      )
      await Promise.all(downloadPromises)
    } catch (error) {
      errorMessage.value = illustrationRequestErrorMessage
    }
    const safeTaleWithIllustrationsGet = handleError(trpc.tale.get.query, errorMessage)
    const taleWithIllustrations = await safeTaleWithIllustrationsGet(taleStore.id)
    pages.value = createPages(taleWithIllustrations)
    taleStore.generationInProgress = false
  }
)

const saveTale = async () => {
  const safeUpdate = handleError(trpc.tale.update.mutate, errorMessage)
  await safeUpdate({ taleId: taleId.value, isSaved: true })
  isSaved.value = true
}

const handleClick = async () => {
  isSaved.value ? router.push('/book') : await saveTale()
}
</script>
<template>
  <div class="main">
    <div class="alert" v-if="errorMessage">
      <AlertToast data-testid="errorMessage" variant="error" title="Error" :text="errorMessage" />
    </div>
    <div v-if="taleStore.isTaleRequestFailed">
      <AlertToast :title="networkErrorTitle" :text="networkErrorMessage" variant="error" />
    </div>
    <div class="content" v-if="pages">
      <CarouselComponent v-slot="{ currentSlide }">
        <CarouselSlide v-for="(page, i) in pages" :key="i">
          <div class="page" v-show="i === currentSlide">
            <img v-if="i === 2 || i === 4" :src="page" width="100%" />
            <div v-else :class="{ title: i === 0 }">{{ page }}</div>
          </div>
        </CarouselSlide>
      </CarouselComponent>
      <ButtonPrimary
        class="btn"
        :text="isSaved ? 'Go to Storybook' : 'Save tale to Storybook'"
        @click="handleClick"
      />
    </div>
    <div v-else-if="taleStore.generationInProgress" class="loader-container">
      <v-skeleton-loader type="text"></v-skeleton-loader>
      <p class="message">Your bedtime story is being generated. Please hang in there ...</p>
      <img src="../../assets/panda.jpg" alt="sad panda" class="unsuccessful" />
    </div>
  </div>
</template>
<style scoped>
.main {
  padding: 2rem;
  width: 100%;
}

.loader-container {
  text-align: center;
}

.message {
  font-size: 1.2rem;
  margin: 30px 0px;
}

.btn {
  margin-top: 40px;
  width: 100vw;
  height: 50px;
}

img {
  border-top-right-radius: 15%;
  border-bottom-right-radius: 15%;
  width: 80%;
}

.unsuccessful {
  border-radius: 15px;
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

  .content {
    width: 650px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .page {
    display: flex;
    justify-content: center;
  }
}
</style>
