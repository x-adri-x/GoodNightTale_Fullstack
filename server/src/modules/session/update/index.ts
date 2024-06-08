import { Session, sessionUpdateSchema } from '@server/entities/session'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure
  .use(provideRepos({ Session }))
  .input(sessionUpdateSchema)
  .mutation(async ({ input: sessionData, ctx: { authUser, repos } }) => {
    const session = {
      ...sessionData,
      userId: authUser.id,
      createdAt: new Date(),
    }

    const affected = await repos.Session.update(
      { userId: authUser.id },
      session
    )

    const updated = await repos.Session.findOneBy({ userId: authUser.id })
    console.log('updated', updated)
    return affected
  })
