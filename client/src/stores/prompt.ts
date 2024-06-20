import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

const chatGPTPrompt =
  'I will provide you with 5 random words, and I would like you to write me ' +
  'a short tale out of those 5 words. It should be between 300 and 500 words, ' +
  'and it should be something clever and nice, suitable for small kids to enjoy ' +
  'before bedtime. Give it a fitting title as well, in the form "Title: ". Use a ' +
  'single line break to separate the title from the tale, and also to create 3 ' +
  'parts in the tale.'

const illustrationStorageKey = 'illustration'

const usePromptStore = defineStore('prompt', () => {
  const stream = ref([
    {
      role: 'system',
      content: chatGPTPrompt,
    },
  ])
  const illustrationPrompts: Ref<string[] | undefined> = ref()
  const illustrationError = ref('')

  function reset() {
    stream.value = [
      {
        role: 'system',
        content: chatGPTPrompt,
      },
    ]
  }

  function updatePrompt(message: any) {
    stream.value.push(message)
  }

  function saveIllustrationPromptsToLocalStorage() {
    try {
      localStorage.setItem(illustrationStorageKey, JSON.stringify(illustrationPrompts.value))
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
