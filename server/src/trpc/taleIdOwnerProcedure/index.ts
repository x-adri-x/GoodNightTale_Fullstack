import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { Tale } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '../provideRepos'

export const taleIdOwnerProcedure = authenticatedProcedure
  .use(provideRepos({ Tale }))
  .input(
    z.object({
      taleId: z.number(),
    })
  )
  .use(async ({ input: { taleId }, ctx: { authUser, repos }, next }) => {
    const tale = await repos.Tale.findOne({
      select: {
        userId: true,
      },
      where: {
        id: taleId,
      },
    })

    if (!tale) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Tale not found',
      })
    }

    if (tale.userId !== authUser.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Tale does not belong to the user',
      })
    }

    return next()
  })
