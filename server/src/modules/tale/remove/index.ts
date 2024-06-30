import { Tale, taleSchema } from '@server/entities/tale'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ Tale }))
  .input(taleSchema.shape.id)
  .mutation(async ({ input: taleId, ctx: { authUser, repos } }) => {
    const userId = authUser.id
    const tale = await repos.Tale.findOne({
      where: { userId, id: taleId },
    })

    if (!tale) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Tale was not found`,
      })
    }
    await repos.Tale.delete({ id: taleId })
  })
