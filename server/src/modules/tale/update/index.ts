import { Tale } from '@server/entities'
import { taleUpdateSchema, type TaleUpdate } from '@server/entities/tale'
import { taleIdOwnerProcedure } from '@server/trpc/taleIdOwnerProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default taleIdOwnerProcedure
  .use(provideRepos({ Tale }))
  .input(taleUpdateSchema)
  .mutation(async ({ input, ctx: { repos } }) => {
    function removeIdFromInput(
      obj: TaleUpdate & { taleId?: number }
    ): Partial<Omit<TaleUpdate, 'id' | 'taleId'>> {
      const { taleId, ...updateObject } = obj
      return updateObject
    }

    if (!input.title && !input.isFavorite) {
      throw new Error("Either 'title' or 'isFavorite' must be provided")
    }

    const updateObject = removeIdFromInput(input)

    const affected = await repos.Tale.update(
      {
        id: input.taleId,
      },
      updateObject
    )

    if (affected.affected === 0) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Tale not found.',
      })
    }

    await repos.Tale.findOneByOrFail({
      id: input.taleId,
    })

    return affected
  })
