import { Session, sessionInsertSchema } from '@server/entities/session'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure
  .use(provideRepos({ Session }))
  .input(sessionInsertSchema)
  .mutation(async ({ input: sessionData, ctx: { authUser, repos } }) => {
    const session = {
      ...sessionData,
      userId: authUser.id,
      createdAt: new Date(),
    }

    const saved = await repos.Session.findOneBy({
      userId: authUser.id,
    })

    if (saved) {
      const affected = await repos.Session.update(
        {
          userId: authUser.id,
        },
        session
      )
      return affected
    }

    const sessionCreated = await repos.Session.save(session)

    return sessionCreated
  })
