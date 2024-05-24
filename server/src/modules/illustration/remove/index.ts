import { taleIdOwnerProcedure } from '@server/trpc/taleIdOwnerProcedure'
import { z } from 'zod'
import removeImage from '@server/modules/illustration/utils/remove'

const removeSchema = z.object({
  name: z.string(),
})

export default taleIdOwnerProcedure
  .input(removeSchema)
  .query(async ({ input: { name } }) => removeImage(name))
