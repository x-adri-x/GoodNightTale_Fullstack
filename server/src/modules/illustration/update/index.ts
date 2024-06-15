import { Illustration } from '@server/entities'
import {
  illustrationUpdateSchema,
  type IllustrationUpdate,
} from '@server/entities/illustration'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { taleIdOwnerProcedure } from '@server/trpc/taleIdOwnerProcedure'

export default taleIdOwnerProcedure
  .use(provideRepos({ Illustration }))
  .input(illustrationUpdateSchema)
  .mutation(async ({ input, ctx: { repos } }) => {
    function removeIdFromInput(obj: IllustrationUpdate & { taleId?: number }) {
      const { taleId, id, ...updateObject } = obj
      return { id, updateObject }
    }

    const { id, updateObject } = removeIdFromInput(input)
    const { affected } = await repos.Illustration.update(
      {
        id,
      },
      {
        ...updateObject,
        createdAt: new Date(),
      }
    )

    if (affected === 0) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Illustration not found.',
      })
    }

    const illustrationUpdated = await repos.Illustration.findOneByOrFail({
      id,
    })

    return illustrationUpdated
  })
