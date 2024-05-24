import { taleIdOwnerProcedure } from '@server/trpc/taleIdOwnerProcedure'
import { z } from 'zod'
import downloadImage from '../utils/download'

const downloadSchema = z.object({
  url: z.string(),
})

export default taleIdOwnerProcedure
  .input(downloadSchema)
  .query(async ({ input: { url } }) => downloadImage(url))
