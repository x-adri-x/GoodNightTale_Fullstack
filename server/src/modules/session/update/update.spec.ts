import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import setupTest from '@server/modules/tests/setup'
import sessionRouter from '..'

const createCaller = createCallerFactory(sessionRouter)

it('updates the saved session tale', async () => {
  // ARRANGE
  const { db, user } = await setupTest()
  const { update, get } = createCaller(authContext({ db }, user))
  const sessionTale = {
    title: 'My First Tale',
    body: ['Once upon a time ...'],
    keys: ['foo', 'bar', 'baz'],
    urls: ['https://foo.png', 'https://bar.png', 'https://baz.png'],
  }

  // ACT
  const updated = await update(sessionTale)
  const updatedSessionTale = await get()

  // ASSERT
  expect(updated.affected).toEqual(1)
  expect(updatedSessionTale).toMatchObject({
    id: expect.any(Number),
    title: 'My First Tale',
    body: ['Once upon a time ...'],
    keys: ['foo', 'bar', 'baz'],
    urls: ['https://foo.png', 'https://bar.png', 'https://baz.png'],
    userId: user.id,
    createdAt: expect.any(Date),
  })
})
