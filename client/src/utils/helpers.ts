import { trpc } from '@/trpc'
import type { SessionInsert } from '@goodnighttale/server/src/shared/entities'
import { TRPCClientError } from '@trpc/client'
import { TRPCError } from '@trpc/server'
import type { Ref } from 'vue'

const illustrationIndexes = '1,3'

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

export const createPages = (tale: SessionInsert): string[] => {
  const tmpBody = tale.body.slice()
  const tmpUrls = tale.urls.slice()
  const pages = []
  pages.push(tale.title)
  illustrationIndexes.split(',').forEach((index, i) => {
    tmpBody.splice(parseInt(index, 10), 0, tmpUrls[i]!)
  })
  pages.push(...tmpBody)
  return pages
}

export const handleError = <Args extends any[]>(fn: Function, errorRef: Ref) => {
  return async function (...args: Args) {
    try {
      return await fn(...args)
    } catch (error) {
      if (!(error instanceof Error)) {
        throw new Error(`Non-Error thrown: ${JSON.stringify(error)}`)
      }
      if (error instanceof TRPCError || error instanceof TRPCClientError) {
        errorRef.value = error.message
      }
      errorRef.value = error.message
    }
  }
}

export const checkUrlValidity = (createdAt: string) => {
  const seconds = (new Date().getTime() - new Date(createdAt).getTime()) / 1000
  return seconds < 86400
}
