import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import provideRepos from '@server/trpc/provideRepos'
import { Tale, type TaleInsert } from '@server/entities/tale'
import { Illustration } from '@server/entities/illustration'
import {
  createTaleObject,
  extractPromptsForIllustrations,
  generateKey,
} from './utils'

export default authenticatedProcedure
  .use(provideRepos({ Tale, Illustration }))
  .input(z.array(z.string()))
  .mutation(async ({ input, ctx: { authUser, generativeAI, repos } }) => {
    if (!generativeAI) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Generative AI must be provided.',
      })
    }

    const initialPrompt =
      'I will provide you with 5 random words, and I would like you to write me ' +
      'a short tale out of those 5 words. It should be between 300 and 500 words, ' +
      'and it should be something clever and nice, suitable for small kids to enjoy ' +
      'before bedtime. Give it a fitting title as well, in the form "Title: ". Use a ' +
      'single line break to separate the title from the tale, and also to create 3 ' +
      'parts in the tale.'

    const dallEPrompt =
      'Now create two prompts for DALL-E to illustrate your tale.' +
      'Do not use names from your tale in the prompts.' +
      'Your answer should be formatted like: prompt1: the first prompt, prompt2: the second prompt'

    const stream = [
      {
        role: 'system',
        content: initialPrompt,
      },
    ]

    const keywords = input

    stream.push({
      role: 'user',
      content: `The ${keywords.length} words are: ${keywords.slice(0).join(', ')}.`,
    })

    let taleText: string
    try {
      const completion = await generativeAI.chatCompletion(stream)
      taleText = completion.choices[0].message.content
    } catch (error) {
      throw new Error(`Chat completion failed: ${JSON.stringify(error)}`)
    }

    const taleData = { ...createTaleObject(taleText), keywords }
    const tale: TaleInsert = {
      ...taleData,
      userId: authUser.id,
    }

    const taleCreated = await repos.Tale.save(tale)
    let prompts
    try {
      stream.push({ role: 'assistant', content: taleText })
      stream.push({ role: 'user', content: dallEPrompt })
      const completion = await generativeAI.chatCompletion(stream)
      prompts = completion.choices[0].message.content
    } catch (error) {
      throw new Error(`Chat completion failed: ${JSON.stringify(error)}`)
    }

    const promptsArray = extractPromptsForIllustrations(prompts)
    const keys = promptsArray?.map((prompt) => generateKey(prompt))
    const illustrations = promptsArray!.map((prompt, i) => ({
      prompt,
      taleId: taleCreated.id,
      key: keys![i],
      createdAt: new Date(),
    }))
    const promises = illustrations.map((i) => repos.Illustration.save(i))
    await Promise.all(promises)

    return taleCreated.id
  })
