import { Chance } from 'chance'

export const random = process.env.CI ? Chance(1) : Chance()

export const fakeGeneratedTale = () => {
  const title = `Title: ${random.string()}\n\n`
  const body = `${random.string()}\n\n${random.string()}\n\n${random.string()}`
  return title + body
}

export const fakePrompts = () => {
  const prompt1 = `prompt1: ${random.string()}`
  const prompt2 = `prompt2: ${random.string()}`
  return `${prompt1}\n${prompt2}`
}
