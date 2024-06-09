import { generate } from 'random-words'
import constants from '@/constants/constants'

export const generateRandomWords = () => {
  const words = generate({ exactly: 10, minLength: 3, maxLength: 10 })
  localStorage.setItem(constants.randomWordsStorageKey, JSON.stringify(words))
  return words
}

export const getRandomWords = () => {
  if (localStorage.getItem(constants.randomWordsStorageKey)) {
    return JSON.parse(localStorage.getItem(constants.randomWordsStorageKey)!)
  }
  const randomWords = generate({ exactly: 10, minLength: 3, maxLength: 10 })
  localStorage.setItem(constants.randomWordsStorageKey, JSON.stringify(randomWords))
  return randomWords
}
