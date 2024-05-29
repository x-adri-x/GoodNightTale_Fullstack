import { router } from '@server/trpc'
import find from './find'
import create from './create'
import update from './update'

export default router({
  find,
  create,
  update,
})
