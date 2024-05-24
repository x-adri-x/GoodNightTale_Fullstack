import { authContext } from '@tests/utils/context'
import { Tale, User } from '@server/entities'
import { fakeTale, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import taleRouter from '..'

const createCaller = createCallerFactory(taleRouter)

it('returns a list of all tale titles', async () => {
  const db = await createTestDatabase()

  const user = await db.getRepository(User).save(fakeUser())

  const created = await db
    .getRepository(Tale)
    .save([fakeTale({ userId: user.id }), fakeTale({ userId: user.id })])

  const { getTitles } = createCaller(authContext({ db }, user))

  // When (ACT)
  const userTalesTitles = await getTitles()

  // Then (ASSERT)
  expect(userTalesTitles).toHaveLength(2)
  expect(userTalesTitles[0]).toBe(created[0].title)
})
