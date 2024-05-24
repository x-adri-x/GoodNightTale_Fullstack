import { Tale, type TaleBare } from '@server/entities/tale'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure
  .use(provideRepos({ Tale }))
  .query(async ({ ctx: { authUser, repos } }) => {
    const userId = authUser.id
    const tales = (await repos.Tale.find({
      where: { userId },
      order: { id: 'ASC' },
    })) as TaleBare[]

    if (!tales) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Tale was not found`,
      })
    }

    if (tales[0].userId !== authUser.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You are not allowed to access this tale.`,
      })
    }

    const titles = tales.map((t) => t.title)

    return titles
  })
