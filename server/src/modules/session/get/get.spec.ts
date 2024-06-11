import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import setupTest from '@server/modules/tests/setup'
import { fakeSession } from '@server/entities/tests/fakes'
import { Session } from '@server/entities'
import sessionRouter from '..'

const createCaller = createCallerFactory(sessionRouter)

it('reutrns the saved session tale', async () => {
  // ARRANGE
  const { db, user } = await setupTest()
  const { get, create } = createCaller(authContext({ db }, user))
  const session = fakeSession({
    userId: user.id,
    title: 'Fake title',
  })

  // ACT
  const created = (await create(session)) as Session
  const sessionTale = await get()

  // ASSERT
  expect(sessionTale).toMatchObject({
    id: created.id,
    title: 'Fake title',
    body: created.body,
    keys: created.keys,
    urls: created.urls,
    userId: user.id,
    createdAt: expect.any(Date),
  })
})
