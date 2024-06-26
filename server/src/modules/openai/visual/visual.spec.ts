import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import VisualRouter from '..'
import setupTest from '../../tests/setup'

const createCaller = createCallerFactory(VisualRouter)

it('tests if visual generation is called', async () => {
  const { db, openai, user, illustrations } = await setupTest()
  const { visual } = createCaller(
    authContext({ db, generativeAI: openai }, user)
  )

  const { taleId } = illustrations[0]

  await visual({ taleId, illustrationIds: [illustrations[0].id] })
  expect(openai.visualGeneration).toHaveBeenCalledOnce()
  expect(openai.visualGeneration).toHaveBeenCalledWith(
    'A picture of a cute brown cat.'
  )
})
