import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import setupTest from '@server/modules/tests/setup'
import sessionRouter from '..'

const createCaller = createCallerFactory(sessionRouter)

it('updates the saved session tale', async () => {
  // ARRANGE
  const { db, user } = await setupTest()
  const { create, update } = createCaller(authContext({ db }, user))
  const tale = {
    title: 'My First Tale',
    body: ['Once upon a time ...'],
    illustrations: ['https://foo.png', 'https://bar.png', 'https://baz.png'],
  }
  console.log('user', user)
  // ACT
  const savedTale = await create(tale)
  console.log('saved', savedTale)
  const updated = await update({
    ...tale,
    illustrations: [
      'https://foo-1.png',
      'https://bar-1.png',
      'https://baz-1.png',
    ],
  })

  // ASSERT
  expect(updated.affected).toEqual(1)
})
