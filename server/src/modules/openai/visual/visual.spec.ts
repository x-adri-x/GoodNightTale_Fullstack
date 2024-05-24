import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import VisualRouter from '..'
import setupTest from '../../tests/setup'

const createCaller = createCallerFactory(VisualRouter)

it('tests if visual generation is called', async () => {
  const { db, openai, user } = await setupTest()
  const { visual } = createCaller(
    authContext({ db, generativeAI: openai }, user)
  )

  await visual('a white siamese cat')
  expect(openai.visualGeneration).toHaveBeenCalledOnce()
  expect(openai.visualGeneration).toHaveBeenCalledWith('a white siamese cat')
})
