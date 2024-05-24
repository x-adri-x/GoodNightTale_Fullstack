import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import setupTest from '@server/modules/tests/setup'
import illustrationRouter from '..'

const createCaller = createCallerFactory(illustrationRouter)

it('returns a list of illuatrations of a given tale', async () => {
  // ARRANGE (Given)
  const { db, tale, user } = await setupTest()
  const { find } = createCaller(authContext({ db }, user))

  // ACT (When)
  const illustrationsFound = await find({
    taleId: tale.id,
  })

  expect(illustrationsFound).toMatchObject([
    { taleId: tale.id },
    { taleId: tale.id },
  ])
})
