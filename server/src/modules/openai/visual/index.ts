import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export default authenticatedProcedure
  .input(z.string())
  .mutation(async ({ input, ctx: { generativeAI } }) => {
    if (!generativeAI) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Generative AI must be provided.',
      })
    }

    try {
      const response = await generativeAI.visualGeneration(input)
      return response
    } catch (error) {
      throw new Error(`Visual generation failed: ${error}`)
    }
  })
