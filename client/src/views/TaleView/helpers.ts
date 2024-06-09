import { trpc } from '@/trpc'
import type { Session } from '@mono/server/src/shared/entities'

export const createSessionObject = (text: string) => {
  const tmp = text
  const parts = tmp.split('\n\n')
  const title = parts[0].split(': ')[1]
  const body = parts.slice(1)
  return { title, body }
}

export const extractPromptsForIllustrations = (prompt: string) => {
  let prompts
  if (prompt) {
    prompts = prompt?.split('\n').map((p) => p.split(': ')[1])
  }
  return prompts
}

export const generateIllustrations = (prompts: string[]) => {
  const promises: any[] = []
  prompts.forEach(async (prompt: string) => {
    promises.push(Promise.resolve(trpc.openai.visual.mutate(prompt)))
  })
  return Promise.all(promises)
}

export const getGeneratedTale = async (): Promise<Session> => {
  const tale = await trpc.session.get.query()
  return tale
}
