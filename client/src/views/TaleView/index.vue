<script setup lang="ts">
import { trpc } from '@/trpc'
import { watch, ref } from 'vue'
import useTaleStore from '@/stores/tale'
import usePromptStore from '@/stores/prompt'
import { useRouter } from 'vue-router'
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
  checkUrlValidity,
  refreshIllustrationUrls,
} from '@/utils/helpers'

const router = useRouter()
const taleStore = useTaleStore()
const promptStore = usePromptStore()
const sessionTale = ref()
const pages = ref()
const errorMessage = ref()
const isSaved = ref()

const getSessionTale = handleError(trpc.session.get.query, errorMessage)
sessionTale.value = await getSessionTale()

if (sessionTale.value && !taleStore.generationInProgress) {
  isSaved.value = sessionTale.value.isSaved
  if (!checkUrlValidity(sessionTale.value.createdAt)) {
    const { urls, error } = await refreshIllustrationUrls(sessionTale.value.keys, errorMessage)
    errorMessage.value = error
    sessionTale.value.urls = urls
    const safeCreate = handleError(trpc.session.create.mutate, errorMessage)
    await safeCreate(sessionTale.value)
  }
  pages.value = createPages(sessionTale.value)
}

watch(
  () => taleStore.tale,
  async () => {
    sessionTale.value = createSessionObject(taleStore.tale)
    sessionTale.value.keywords = taleStore.keywords
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
    sessionTale.value.prompts = promptStore.illustrationPrompts
    const safeGenerateIllustrations = handleError(generateIllustrations, errorMessage)
    const response = await safeGenerateIllustrations(sessionTale.value.prompts)
    const illustrationUrls = response.map((r: { data: { url: string }[] }) => r.data[0].url)
    const safeIllustrationUpload = handleError(trpc.illustration.upload.mutate, errorMessage)
    const uploads = illustrationUrls.map(async (url: string) => await safeIllustrationUpload(url))

    sessionTale.value.keys = await Promise.all(uploads)
    const { urls, error } = await refreshIllustrationUrls(sessionTale.value.keys, errorMessage)
    errorMessage.value = error
    sessionTale.value.urls = urls
    const safeCreate = handleError(trpc.session.create.mutate, errorMessage)
    await safeCreate({ ...sessionTale.value, isSaved: false })
    pages.value = createPages(sessionTale.value)
    taleStore.generationInProgress = false
  }
)

const createIllustrationObjects = () => {
  return sessionTale.value.prompts.map((prompt: string, index: number) => {
    return { prompt, key: sessionTale.value.keys[index], url: sessionTale.value.urls[index] }
  })
}

const saveTale = async () => {
  const safeSaveTale = handleError(trpc.tale.create.mutate, errorMessage)
  const saved = await safeSaveTale({
    title: sessionTale.value.title,
    body: sessionTale.value.body,
    keywords: sessionTale.value.keywords,
  })
  const illustrations = createIllustrationObjects()
  illustrations!.forEach(
    async (i: { taleId: number; prompt: string; url: string; key: string }) =>
      await trpc.illustration.create.mutate({ ...i, taleId: saved.id })
  )
  isSaved.value = true
  sessionTale.value.isSaved = true
  const safeCreate = handleError(trpc.session.create.mutate, errorMessage)
  await safeCreate(sessionTale.value)
}

const handleClick = async () => {
  isSaved.value ? router.push('/book') : await saveTale()
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
      <ButtonPrimary
        class="btn"
        :text="isSaved ? 'Go to Storybook' : 'Save tale to Storybook'"
        @click="handleClick"
      />
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
