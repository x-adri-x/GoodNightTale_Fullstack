import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import setupTest from '@server/modules/tests/setup'
import sessionRouter from '..'

const createCaller = createCallerFactory(sessionRouter)

it('saves a tale into session', async () => {
  // ARRANGE
  const { db, user } = await setupTest()
  const { create } = createCaller(authContext({ db }, user))

  // ACT
  const sessionCreated = await create({
    title: 'My First Tale',
    body: ['Once upon a time ...'],
    illustrations: ['https://foo.png', 'https://bar.png', 'https://baz.png'],
  })

  // ASSERT
  expect(sessionCreated).toMatchObject({
    id: expect.any(Number),
    title: 'My First Tale',
    body: ['Once upon a time ...'],
    illustrations: ['https://foo.png', 'https://bar.png', 'https://baz.png'],
    userId: user.id,
    createdAt: expect.any(Date),
  })
})
