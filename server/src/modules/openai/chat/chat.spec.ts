import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import setupTest from '../../tests/setup'
import chatRouter from '..'

const createCaller = createCallerFactory(chatRouter)

it('tests if chat completion is called', async () => {
  const { db, openai, user } = await setupTest()
  const { chat } = createCaller(authContext({ db, generativeAI: openai }, user))

  await chat(['foo', 'bar', 'baz'])
  expect(openai.chatCompletion).toHaveBeenCalledTimes(2)
})

it('returns the id of a created tale', async () => {
  const { db, openai, user } = await setupTest()
  const { chat } = createCaller(authContext({ db, generativeAI: openai }, user))

  const taleId = await chat(['foo', 'bar', 'baz'])
  expect(taleId).toStrictEqual(expect.any(Number))
})
