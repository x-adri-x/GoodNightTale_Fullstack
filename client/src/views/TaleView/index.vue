<script setup lang="ts">
import { trpc } from '@/trpc'
import { watch, ref } from 'vue'
import useTaleStore from '@/stores/tale'
import usePromptStore from '@/stores/prompt'
import constants from '@/constants/constants'
import AlertToast from '@/components/AlertToast.vue'
import {
  createSessionObject,
  extractPromptsForIllustrations,
  generateIllustrations,
} from './helpers'

const taleStore = useTaleStore()
const promptStore = usePromptStore()
const tale = ref('')
const sessionTale = ref()

watch(
  () => taleStore.tale,
  async () => {
    tale.value = taleStore.tale
    sessionTale.value = createSessionObject(tale.value)
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
      const illustrations = await Promise.all(uploads)
      await trpc.session.create.mutate({ ...sessionTale.value, illustrations })
      const downloads = illustrations.map(
        async (key) => await trpc.illustration.download.query(key)
      )
      const urls = await Promise.all(downloads)
      taleStore.generationInProgress = false
    } catch (error) {
      throw new Error(`An error has occured while creating the images:  ${error}`)
    }
  }
)
</script>
<template>
  <div>{{ tale }}</div>
  <div v-if="taleStore.isTaleRequestFailed">
    <AlertToast
      :title="constants.networkErrorTitle"
      :text="constants.networkErrorMessage"
      variant="error"
    />
  </div>
</template>
@/views/TaleView/helpers
