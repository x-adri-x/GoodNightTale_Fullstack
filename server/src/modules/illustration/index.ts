import { router } from '@server/trpc'
import find from './find'
import create from './create'
import update from './update'
import upload from './upload'
import download from './download'

export default router({
  find,
  create,
  update,
  upload,
  download,
})
