import { router } from '@server/trpc'
import find from './find'
import create from './create'
import update from './update'
import download from './download'
import remove from './remove'

export default router({
  find,
  create,
  update,
  remove,
  download,
})
