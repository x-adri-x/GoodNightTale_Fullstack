import { router } from '../trpc'
import illustration from './illustration'
import tale from './tale'
import user from './user'
import openai from './openai'
import session from './session'

export const appRouter = router({
  illustration,
  tale,
  user,
  openai,
  session,
})

export type AppRouter = typeof appRouter
