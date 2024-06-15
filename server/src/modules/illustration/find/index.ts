import { taleIdOwnerProcedure } from '@server/trpc/taleIdOwnerProcedure'
import {
  type IllustrationBare,
  Illustration,
  illustrationSchema,
} from '@server/entities/illustration'
import provideRepos from '@server/trpc/provideRepos'

export default taleIdOwnerProcedure
  .use(provideRepos({ Illustration }))
  .input(
    illustrationSchema.pick({
      taleId: true,
    })
  )
  .query(async ({ input, ctx: { repos } }) => {
    const { taleId } = input
    const illustrations = (await repos.Illustration.find({
      where: {
        taleId,
      },
      order: { id: 'DESC' },
    })) as IllustrationBare[]

    return illustrations
  })
