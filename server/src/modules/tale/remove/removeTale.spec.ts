import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import setupTest from '@server/modules/tests/setup'
import taleRouter from '..'

const createCaller = createCallerFactory(taleRouter)

it('deletes a tale from the database', async () => {
  const { db, tale, user } = await setupTest()
  const { remove, find } = createCaller(authContext({ db }, user))

  // When (ACT)
  await remove(tale.id)
  const tales = await find()
  const deletedTale = tales.filter((t) => t.id === tale.id)
  // Then (ASSERT)
  expect(deletedTale).toHaveLength(0)
})
