import { Illustration } from '@server/entities'
import { illustrationUpdateSchema } from '@server/entities/illustration'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .use(provideRepos({ Illustration }))
  .input(illustrationUpdateSchema)
  .mutation(async ({ input, ctx: { repos } }) => {
    const { id, isTemp } = input
    const { affected } = await repos.Illustration.update(
      {
        id,
      },
      {
        isTemp,
        createdAt: new Date(),
      }
    )

    if (affected === 0) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Illustration not found.',
      })
    }

    const illustrationUpdated = await repos.Illustration.findOneByOrFail({
      id,
    })

    return illustrationUpdated
  })
