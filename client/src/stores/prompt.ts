import { defineStore } from 'pinia'
import { ref } from 'vue'
import constants from '@/constants/constants'

const usePromptStore = defineStore('prompt', () => {
  const stream = ref([
    {
      role: 'system',
      content: constants.chatGPTPrompt,
    },
  ])
  const illustrationPrompts = ref()
  const illustrationError = ref('')

  function reset() {
    stream.value = [
      {
        role: 'system',
        content: constants.chatGPTPrompt,
      },
    ]
  }

  function updatePrompt(message: any) {
    stream.value.push(message)
  }

  function saveIllustrationPromptsToLocalStorage() {
    try {
      localStorage.setItem(
        constants.illustrationStorageKey,
        JSON.stringify(illustrationPrompts.value)
      )
    } catch (error: any) {
      illustrationError.value = error.message
    }
  }

  return {
    stream,
    reset,
    illustrationPrompts,
    updatePrompt,
    saveIllustrationPromptsToLocalStorage,
  }
})

export default usePromptStore
