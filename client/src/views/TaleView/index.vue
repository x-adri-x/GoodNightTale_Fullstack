<script setup lang="ts">
import { trpc } from '@/trpc'
import { watch, ref } from 'vue'
import useTaleStore from '@/stores/tale'
import usePromptStore from '@/stores/prompt'
import constants from '@/constants/constants'
import AlertToast from '@/components/AlertToast.vue'
import CarouselComponent from './CarouselComponent.vue'
import CarouselSlide from './CarouselSlide.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import {
  createPages,
  createSessionObject,
  extractPromptsForIllustrations,
  generateIllustrations,
  handleError,
  checkImageValidity,
} from './helpers'

const taleStore = useTaleStore()
const promptStore = usePromptStore()
const sessionTale = ref()
const pages = ref()
const errorMessage = ref()

const getSessionTale = handleError(trpc.session.get.query, errorMessage)
const tale = await getSessionTale()

if (tale && !taleStore.generationInProgress) {
  if (!checkImageValidity(tale.createdAt)) {
    const safeIllustrationDownload = handleError(trpc.illustration.download.query, errorMessage)
    const downloads = tale.keys.map(async (key: string) => await safeIllustrationDownload(key))
    tale.urls = await Promise.all(downloads)
    const safeCreate = handleError(trpc.session.create.mutate, errorMessage)
    await safeCreate(tale)
  }
  pages.value = createPages(tale)
}

watch(
  () => taleStore.tale,
  async () => {
    sessionTale.value = createSessionObject(taleStore.tale)
    promptStore.updatePrompt({ role: 'assistant', content: taleStore.tale })
    promptStore.updatePrompt({ role: 'user', content: constants.dallEPrompt })
    try {
      const prompts = await trpc.openai.chat.mutate(promptStore.stream)
      promptStore.illustrationPrompts = extractPromptsForIllustrations(prompts)
    } catch (error) {
      if (!(error instanceof Error)) throw error
      console.log(`Something went wrong while generating illustrations: ${error.message}`)
    }
  }
)

watch(
  () => promptStore.illustrationPrompts,
  async () => {
    const safeGenerateIllustrations = handleError(generateIllustrations, errorMessage)
    const response = await safeGenerateIllustrations(promptStore.illustrationPrompts!)
    const illustrationUrls = response.map((r: { data: { url: string }[] }) => r.data[0].url)
    const safeIllustrationUpload = handleError(trpc.illustration.upload.mutate, errorMessage)
    const uploads = illustrationUrls.map(async (url: string) => await safeIllustrationUpload(url))

    sessionTale.value.keys = await Promise.all(uploads)
    const safeIllustrationDownload = handleError(trpc.illustration.download.query, errorMessage)
    const downloads = sessionTale.value.keys.map(
      async (key: string) => await safeIllustrationDownload(key)
    )
    sessionTale.value.urls = await Promise.all(downloads)
    const safeCreate = handleError(trpc.session.create.mutate, errorMessage)
    await safeCreate(sessionTale.value)
    pages.value = createPages(sessionTale.value)
    taleStore.generationInProgress = false
  }
)

const createIllustrationObjects = () => {
  if (promptStore.illustrationPrompts) {
    return promptStore.illustrationPrompts.map((prompt, index) => {
      return { prompt, name: sessionTale.value.keys[index], url: sessionTale.value.urls[index] }
    })
  }
}

const saveTale = async () => {
  const saved = await trpc.tale.create.mutate({
    ...sessionTale.value,
    keywords: taleStore.keywords,
  })

  const illustrations = createIllustrationObjects()
  illustrations!.forEach(
    async (i) => await trpc.illustration.create.mutate({ ...i, taleId: saved.id })
  )
}
</script>
<template>
  <div class="main">
    <div v-if="errorMessage">
      <AlertToast data-testid="errorMessage" variant="error" title="Error" :text="errorMessage" />
    </div>
    <div v-if="taleStore.isTaleRequestFailed">
      <AlertToast
        :title="constants.networkErrorTitle"
        :text="constants.networkErrorMessage"
        variant="error"
      />
    </div>
    <div v-if="pages">
      <CarouselComponent v-slot="{ currentSlide }">
        <CarouselSlide v-for="(page, i) in pages" :key="i">
          <div v-show="i === currentSlide">
            <img v-if="i === 2 || i === 4" :src="page" width="100%" alt="alt" />
            <div v-else :class="{ title: i === 0 }">{{ page }}</div>
          </div>
        </CarouselSlide>
      </CarouselComponent>
      <ButtonPrimary class="btn" text="Save tale to Storybook" @click="saveTale" />
    </div>
    <v-skeleton-loader v-else-if="taleStore.generationInProgress" type="text"></v-skeleton-loader>
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

img {
  border-top-right-radius: 15%;
  border-bottom-right-radius: 15%;
}

.title {
  font-size: 1.3rem;
}
</style>
