import { Chance } from 'chance'
import config from '@server/config'

const random = config.isCi ? Chance(1) : Chance()

export const extractPromptsForIllustrations = (prompt: string) => {
  let prompts
  if (prompt) {
    prompts = prompt?.split('\n').map((p) => p.split(': ')[1])
  }
  return prompts
}

export const createTaleObject = (text: string) => {
  const tmp = text
  const parts = tmp.split('\n\n')
  const title = parts[0].split(': ')[1]
  const body = parts.slice(1)
  return { title, body }
}

export const generateKey = (prompt: string) => {
  const key = prompt.slice().slice(0, 15).replace(/\s/g, '')
  return key + random.string()
}
