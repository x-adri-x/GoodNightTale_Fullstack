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
import { createPages } from './helpers'
import {
  createSessionObject,
  extractPromptsForIllustrations,
  generateIllustrations,
} from './helpers'

const taleStore = useTaleStore()
const promptStore = usePromptStore()
const tale = ref('')
const sessionTale = ref()
const pages = ref()

watch(
  () => taleStore.tale,
  async () => {
    sessionTale.value = createSessionObject(taleStore.tale)
    promptStore.updatePrompt({ role: 'assistant', content: taleStore.tale })
    promptStore.updatePrompt({ role: 'user', content: constants.dallEPrompt })
    const prompts = await trpc.openai.chat.mutate(promptStore.stream)
    promptStore.illustrationPrompts = extractPromptsForIllustrations(prompts)
  }
)

watch(
  () => promptStore.illustrationPrompts,
  async () => {
    try {
      const response = await generateIllustrations(promptStore.illustrationPrompts)
      const illustrationUrls = response.map((r) => r.data[0].url)
      const uploads = illustrationUrls.map(
        async (url) => await trpc.illustration.upload.mutate(url)
      )
      sessionTale.value.keys = await Promise.all(uploads)
      const downloads = sessionTale.value.keys.map(
        async (key: string) => await trpc.illustration.download.query(key)
      )
      // const urls = await Promise.all(downloads)
      sessionTale.value.urls = await Promise.all(downloads)
      await trpc.session.create.mutate(sessionTale.value)
      pages.value = createPages(sessionTale.value)
      taleStore.generationInProgress = false
    } catch (error) {
      throw new Error(`An error has occured while creating the images:  ${error}`)
    }
  }
)

const createIllustrationObjects = () => {
  return promptStore.illustrationPrompts.map((prompt, index) => {
    return { prompt, name: sessionTale.value.keys[index], url: sessionTale.value.urls[index] }
  })
}

const saveTale = async () => {
  console.log(sessionTale.value)
  const saved = await trpc.tale.create.mutate({
    ...sessionTale.value,
    keywords: taleStore.keywords,
  })

  console.log('saved tale', saved)
  const illustrations = createIllustrationObjects()
  illustrations.forEach(
    async (i) => await trpc.illustration.create.mutate({ ...i, taleId: saved.id })
  )
}
</script>
<template>
  <div class="main">
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
