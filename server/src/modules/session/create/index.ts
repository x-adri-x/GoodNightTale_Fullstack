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

    const sessionCreated = await repos.Session.save(session)

    return sessionCreated
  })
