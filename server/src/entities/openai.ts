import { z } from 'zod'

const chatCompletionMessageParamSchema = z.object({
  role: z
    .string()
    .refine(
      (val) => val === 'user' || val === 'assistant' || val === 'system',
      {
        message: "Role must be 'user', 'assistant', or 'system'",
      }
    ),
  content: z.string(),
})

export const chatCompletionMessageArraySchema = z.array(
  chatCompletionMessageParamSchema
)

export type ChatCompletionMessageArray = z.infer<
  typeof chatCompletionMessageArraySchema
>
