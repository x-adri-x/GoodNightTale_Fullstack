import { router } from '@server/trpc'
import create from './create'
import get from './get'
import update from './update'

export default router({
  create,
  get,
  update,
})
