import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import setupTest from '@server/modules/tests/setup'
import taleRouter from '..'

const createCaller = createCallerFactory(taleRouter)

it('creates a tale', async () => {
  // ARRANGE
  const { db, user } = await setupTest()
  const { create } = createCaller(authContext({ db }, user))

  // ACT
  const taleCreated = await create({
    title: 'My First Tale',
    body: ['Once upon a time', 'There lived a boy'],
    keywords: ['foo', 'bar', 'baz'],
  })

  // ASSERT
  expect(taleCreated).toMatchObject({
    id: expect.any(Number),
    title: 'My First Tale',
    body: ['Once upon a time', 'There lived a boy'],
    keywords: ['foo', 'bar', 'baz'],
    isFavorite: null,
    userId: user.id,
  })
})
