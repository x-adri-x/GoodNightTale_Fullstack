import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

const useTaleStore = defineStore('tale', () => {
  const id: Ref<number | undefined> = ref()
  const isTaleRequestFailed = ref(false)
  const generationInProgress = ref(false)

  return {
    id,
    generationInProgress,
    isTaleRequestFailed,
  }
})

export default useTaleStore
