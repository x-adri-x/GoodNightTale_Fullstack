import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { chatCompletionMessageArraySchema } from '@server/entities/openai'

export default authenticatedProcedure
  .input(chatCompletionMessageArraySchema)
  .mutation(async ({ input, ctx: { generativeAI } }) => {
    if (!generativeAI) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Generative AI must be provided.',
      })
    }

    try {
      const completion = await generativeAI.chatCompletion(input)
      return completion.choices[0].message.content
    } catch (error) {
      throw new Error(`Chat completion failed: ${JSON.stringify(error)}`)
    }
  })
