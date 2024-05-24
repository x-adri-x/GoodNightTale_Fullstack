import { authContext } from '@tests/utils/context'
import { Tale, User } from '@server/entities'
import { fakeTale, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import taleRouter from '..'

const createCaller = createCallerFactory(taleRouter)

it('returns a list of tales', async () => {
  const db = await createTestDatabase()

  // a pair of users and projects to make sure we do not return other users' tales
  const [user, userOther] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  await db
    .getRepository(Tale)
    .save([fakeTale({ userId: user.id }), fakeTale({ userId: userOther.id })])

  const { find } = createCaller(authContext({ db }, user))

  // When (ACT)
  const userTales = await find()

  // Then (ASSERT)
  expect(userTales).toHaveLength(1)
  expect(userTales[0]).toMatchObject({
    id: expect.any(Number),
    userId: user.id,

    // no relations
    user: undefined,
    illustrations: undefined,
  })
})
