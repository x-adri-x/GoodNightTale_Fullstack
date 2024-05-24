import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import setupTest from '../../tests/setup'
import chatRouter from '..'

const createCaller = createCallerFactory(chatRouter)

it('tests if chat completion is called', async () => {
  const { db, openai, user } = await setupTest()
  const { chat } = createCaller(authContext({ db, generativeAI: openai }, user))

  await chat([{ role: 'system', content: 'You are a good AI' }])
  expect(openai.chatCompletion).toHaveBeenCalledOnce()
  expect(openai.chatCompletion).toHaveBeenCalledWith([
    { role: 'system', content: 'You are a good AI' },
  ])
})
