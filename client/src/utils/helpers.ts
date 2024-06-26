import type { Tale } from '@goodnighttale/server/src/shared/entities'
import { TRPCClientError } from '@trpc/client'
import { TRPCError } from '@trpc/server'
import type { Ref } from 'vue'

const illustrationIndexes = '1,3'

export const createPages = (tale: Tale): (string | String)[] => {
  const urls = tale.illustrations.map((i) => i.url)
  const pages = []
  pages.push(tale.title)
  illustrationIndexes.split(',').forEach((index, i) => {
    tale.body.splice(parseInt(index, 10), 0, urls[i])
  })
  pages.push(...tale.body)
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

export const checkIllustrationExpiration = (createdAt: string) => {
  const seconds = (new Date().getTime() - new Date(createdAt).getTime()) / 1000
  return seconds < 86400
}
