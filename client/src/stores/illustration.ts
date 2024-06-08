import { defineStore } from 'pinia'
import { ref } from 'vue'
import constants from '@/constants/constants'

const useIllustrationStore = defineStore('illustration', () => {
  const illustrationUrls = ref([])
  const created: number = Date.now()
  const illustrationRequestFailed = ref(false)

  function saveCreatedToLocalStorage() {
    localStorage.setItem(constants.createdAtStorageKey, JSON.stringify(created))
  }

  function reset() {
    illustrationRequestFailed.value = false
  }

  return {
    illustrationUrls,
    reset,
    illustrationRequestFailed,
    created,
    saveCreatedToLocalStorage,
  }
})

export default useIllustrationStore
