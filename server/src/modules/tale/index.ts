import { router } from '@server/trpc'
import create from './create'
import find from './find'
import get from './get'
import update from './update'
import remove from './remove'
import getTitles from './getTitles'

export default router({
  create,
  find,
  get,
  getTitles,
  update,
  remove,
})
