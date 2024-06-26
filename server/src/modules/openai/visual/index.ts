import { taleIdOwnerProcedure } from '@server/trpc/taleIdOwnerProcedure'
import { TRPCError } from '@trpc/server'
import { Tale } from '@server/entities/tale'
import provideRepos from '@server/trpc/provideRepos'
import { Illustration } from '@server/entities/illustration'
import { z } from 'zod'

export default taleIdOwnerProcedure
  .use(provideRepos({ Tale, Illustration }))
  .input(
    z.object({
      illustrationIds: z.array(z.number()),
    })
  )
  .mutation(async ({ input, ctx: { generativeAI, authUser, repos } }) => {
    if (!generativeAI) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Generative AI must be provided.',
      })
    }

    const { taleId, illustrationIds } = input

    const tale = await repos.Tale.findOne({
      where: { id: taleId },
      relations: ['illustrations'],
    })

    if (tale?.userId !== authUser.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Tale id is not recognized.',
      })
    }

    const incorrectIllustrationIds = illustrationIds.map((id: number) =>
      tale.illustrations.map((i) => i.id).includes(id)
    )

    if (incorrectIllustrationIds.includes(false)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Illustration id-s not recognized.',
      })
    }

    const illustrationPromises = illustrationIds.map(async (id) =>
      repos.Illustration.findOneBy({ id })
    )
    const illustrations = await Promise.all(illustrationPromises)
    const prompts = illustrations.map((i) => i!.prompt)

    let urls
    try {
      const aiPromises = prompts.map((p) => generativeAI.visualGeneration(p))
      const responses = await Promise.all(aiPromises)
      urls = responses.map((r) => r.data[0].url)
    } catch (error) {
      throw new Error(`Visual generation failed: ${error}`)
    }

    const urlPromises = urls.map((url, i) =>
      repos.Illustration.update(
        { id: illustrationIds[i] },
        { url, createdAt: new Date() }
      )
    )
    await Promise.all(urlPromises)
  })
