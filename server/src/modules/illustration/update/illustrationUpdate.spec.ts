import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import setupTest from '@server/modules/tests/setup'
import illustrationRouter from '..'

const createCaller = createCallerFactory(illustrationRouter)

it('updates isTemp value', async () => {
  const { db, user, illustrations } = await setupTest()
  const { update } = createCaller(authContext({ db }, user))

  const updated = await update({
    id: illustrations[0].id,
    isTemp: true,
  })
  expect(updated.isTemp).toBe(true)
})

it('throws an error if illustration is not found', async () => {
  // ARRANGE (Given)
  const {
    db,
    illustrations: [illustration],
    user,
  } = await setupTest()
  const { update } = createCaller(authContext({ db }, user))

  // ACT (When) & ASSERT (Then)
  await expect(
    update({
      id: illustration.id + 12345,
      isTemp: false,
    })
  ).rejects.toThrow(/not found/i)
})
