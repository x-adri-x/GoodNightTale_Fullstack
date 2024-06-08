import { defineStore } from 'pinia'
import { ref } from 'vue'
import constants from '@/constants/constants'

const useTaleStore = defineStore('tale', () => {
  const tale = ref('')
  const isTaleRequestFailed = ref(false)

  function saveTaleToLocalStorage() {
    try {
      localStorage.setItem(constants.taleStorageKey, JSON.stringify(tale.value))
    } catch (e) {
      throw new Error(`Saving tale to localStorage has failed: ${e}`)
    }
  }

  function getTaleFromLocalStorage() {
    try {
      const taleFromLocalStorage = localStorage.getItem(constants.taleStorageKey)
      tale.value = JSON.parse(taleFromLocalStorage!)
    } catch (e) {
      throw new Error(`Retrieving tale from localStorage has failed: ${e}`)
    }
  }

  return {
    tale,
    isTaleRequestFailed,
    saveTaleToLocalStorage,
    getTaleFromLocalStorage,
  }
})

export default useTaleStore
