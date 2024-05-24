import { Tale, taleInsertSchema } from '@server/entities/tale'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure
  .use(provideRepos({ Tale }))
  .input(taleInsertSchema.omit({ userId: true }))
  .mutation(async ({ input: taleData, ctx: { authUser, repos } }) => {
    const tale = {
      ...taleData,
      userId: authUser.id,
    }

    const taleCreated = await repos.Tale.save(tale)

    return taleCreated
  })
