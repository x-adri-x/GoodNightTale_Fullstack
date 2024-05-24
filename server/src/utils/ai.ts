import { ChatCompletionMessageArray } from '@server/entities/openai'
import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY

const openai = new OpenAI({
  apiKey,
})

const ai = {
  chatCompletion: async (messages: ChatCompletionMessageArray) => {
    const completion = await openai.chat.completions.create({
      messages: messages as OpenAI.ChatCompletionMessageParam[],
      model: 'gpt-3.5-turbo',
    })
    return completion
  },

  visualGeneration: async (prompt: string) => {
    const response = openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: parseInt('1', 10),
      size: '1024x1024',
    })
    return response
  },
}

export default ai
