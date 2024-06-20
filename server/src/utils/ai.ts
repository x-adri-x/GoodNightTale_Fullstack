import { ChatCompletionMessageArray } from '@server/entities/openai'
import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY
const chatModel = 'gpt-3.5-turbo'
const imageModel = 'dall-e-3'
const numberOfImages = 1

const openai = new OpenAI({
  apiKey,
})

const ai = {
  chatCompletion: async (messages: ChatCompletionMessageArray) => {
    const completion = await openai.chat.completions.create({
      messages: messages as OpenAI.ChatCompletionMessageParam[],
      model: chatModel,
    })
    return completion
  },

  visualGeneration: async (prompt: string) => {
    const response = openai.images.generate({
      model: imageModel,
      prompt,
      n: numberOfImages,
      size: '1024x1024',
    })
    return response
  },
}

export default ai
