import { Illustration } from '@server/entities'
import { illustrationInsertSchema } from '@server/entities/illustration'
import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { taleIdOwnerProcedure } from '@server/trpc/taleIdOwnerProcedure'

export default taleIdOwnerProcedure
  .use(provideRepos({ Illustration }))
  .input(illustrationInsertSchema)
  .mutation(async ({ input: illustration, ctx: { repos } }) => {
    const tale = await repos.Illustration.findOneBy({
      id: illustration.taleId,
    })

    if (!tale) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Tale not found',
      })
    }

    const illustrationCreated = await repos.Illustration.save(illustration)

    return illustrationCreated
  })
