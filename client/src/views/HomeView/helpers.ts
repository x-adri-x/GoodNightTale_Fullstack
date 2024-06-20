import { generate } from 'random-words'

const randomWordsStorageKey = 'random'

export const generateRandomWords = () => {
  const words = generate({ exactly: 10, minLength: 3, maxLength: 10 })
  localStorage.setItem(randomWordsStorageKey, JSON.stringify(words))
  return words
}

export const getRandomWords = () => {
  if (localStorage.getItem(randomWordsStorageKey)) {
    return JSON.parse(localStorage.getItem(randomWordsStorageKey)!)
  }
  const randomWords = generate({ exactly: 10, minLength: 3, maxLength: 10 })
  localStorage.setItem(randomWordsStorageKey, JSON.stringify(randomWords))
  return randomWords
}
