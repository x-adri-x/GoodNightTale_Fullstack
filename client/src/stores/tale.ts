import { defineStore } from 'pinia'
import { ref } from 'vue'

const useTaleStore = defineStore('tale', () => {
  const tale = ref('')
  const isTaleRequestFailed = ref(false)
  const generationInProgress = ref(false)
  const keywords = ref()

  return {
    tale,
    keywords,
    generationInProgress,
    isTaleRequestFailed,
  }
})

export default useTaleStore
