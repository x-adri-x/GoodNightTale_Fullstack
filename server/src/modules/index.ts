import { router } from '../trpc'
import illustration from './illustration'
import tale from './tale'
import user from './user'
import openai from './openai'

export const appRouter = router({
  illustration,
  tale,
  user,
  openai,
})

export type AppRouter = typeof appRouter
