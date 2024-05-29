import { Tale, taleSchema } from '@server/entities/tale'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ Tale }))
  .input(taleSchema.shape.id)
  .query(async ({ input: taleId, ctx: { authUser, repos } }) => {
    const tale = (await repos.Tale.findOne({
      where: { id: taleId },
      relations: ['illustrations'],
    })) as Tale

    if (!tale) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Tale was not found`,
      })
    }

    if (tale.userId !== authUser.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You are not allowed to access this tale.`,
      })
    }

    return tale
  })
