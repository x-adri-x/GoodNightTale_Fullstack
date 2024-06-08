import { Session } from '@server/entities/session'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ Session }))
  .query(async ({ ctx: { authUser, repos } }) => {
    const tale = await repos.Session.findOne({
      where: { id: authUser.id },
    })

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
