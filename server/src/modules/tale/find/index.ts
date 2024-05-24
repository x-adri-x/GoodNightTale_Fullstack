import { Tale, type TaleBare } from '@server/entities/tale'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure
  .use(provideRepos({ Tale }))
  .query(async ({ ctx: { authUser, repos } }) => {
    const userId = authUser.id
    const tales = (await repos.Tale.find({
      where: { userId },
      order: { id: 'ASC' },
    })) as TaleBare[]

    return tales
  })
