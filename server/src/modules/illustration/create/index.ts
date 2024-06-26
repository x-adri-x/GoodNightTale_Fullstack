import { Illustration, Tale } from '@server/entities'
import { illustrationInsertSchema } from '@server/entities/illustration'
import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { taleIdOwnerProcedure } from '@server/trpc/taleIdOwnerProcedure'
import { Chance } from 'chance'
import config from '@server/config'

export default taleIdOwnerProcedure
  .use(provideRepos({ Illustration, Tale }))
  .input(illustrationInsertSchema)
  .mutation(async ({ input: illustration, ctx: { repos } }) => {
    const tale = await repos.Tale.findOneBy({
      id: illustration.taleId,
    })

    if (!tale) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Tale not found',
      })
    }

    const random = config.isCi ? Chance(1) : Chance()
    const key =
      illustration.prompt.slice().slice(0, 15).replace(/\s/g, '') +
      random.string()
    const illustrationCreated = await repos.Illustration.save({
      ...illustration,
      key,
    })

    return illustrationCreated
  })
