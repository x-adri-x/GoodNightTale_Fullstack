import { router } from '@server/trpc'
import visual from './visual'
import chat from './chat'

export default router({
  chat,
  visual,
})
