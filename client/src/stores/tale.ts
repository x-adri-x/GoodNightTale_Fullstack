import { defineStore } from 'pinia'
import { ref } from 'vue'

const useTaleStore = defineStore('tale', () => {
  const tale = ref('')
  const isTaleRequestFailed = ref(false)
  const generationInProgress = ref(false)

  return {
    tale,
    generationInProgress,
    isTaleRequestFailed,
  }
})

export default useTaleStore
