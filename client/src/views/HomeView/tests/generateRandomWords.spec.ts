import { generateRandomWords, getRandomWords } from '../helpers'

const randomWordsStorageKey = 'random'

describe('random words generation', () => {
  it('should return exactly 10 words', () => {
    const words = generateRandomWords()
    expect(words).toHaveLength(10)
  })

  it('should return words of a mininmum lenght of 3', () => {
    const words = generateRandomWords() as string[]
    const shortWords = words.filter((w) => w.length < 3)
    expect(shortWords).toHaveLength(0)
  })

  it('should return words of a maximum lenght of 10', () => {
    const words = generateRandomWords() as string[]
    const longWords = words.filter((w) => w.length > 10)
    expect(longWords).toHaveLength(0)
  })

  it('should save words into localStorage', () => {
    const words = generateRandomWords()
    const storage = localStorage.getItem(randomWordsStorageKey)
    expect(JSON.parse(storage!)).toEqual(words)
  })
})

describe('get random words from localStorage', () => {
  it('should return words from the localStorage', () => {
    generateRandomWords()
    const words = getRandomWords()
    expect(words).toHaveLength(10)
  })

  it('should generate a new list of words if localStorage is empty', () => {
    const first = generateRandomWords()
    localStorage.removeItem(randomWordsStorageKey)
    expect(localStorage.getItem(randomWordsStorageKey)).toBeNull()
    const second = getRandomWords()
    const storage = localStorage.getItem(randomWordsStorageKey)
    expect(JSON.parse(storage!)).not.toEqual(first)
    expect(JSON.parse(storage!)).toEqual(second)
  })
})
