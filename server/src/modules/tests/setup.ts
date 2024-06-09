import { createTestDatabase } from '@tests/utils/database'
import {
  fakeIllustration,
  fakeTale,
  fakeUser,
} from '@server/entities/tests/fakes'
import { Illustration, Tale, User } from '@server/entities'

/**
 * Sets up the necessary data for the module tests.
 */
export default async function setupTest() {
  const db = await createTestDatabase()

  const users = await db.getRepository(User).save([fakeUser(), fakeUser()])

  const tales = await db
    .getRepository(Tale)
    .save([
      fakeTale({ userId: users[0].id }),
      fakeTale({ userId: users[1].id }),
    ])

  const illustrations = await db
    .getRepository(Illustration)
    .save([
      fakeIllustration({ taleId: tales[0].id }),
      fakeIllustration({ taleId: tales[1].id }),
      fakeIllustration({ taleId: tales[0].id }),
    ])

  const openai = {
    chatCompletion: vi.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: 'Mocked response content',
          },
        },
      ],
    }),
    visualGeneration: vi.fn(),
  }
  return {
    db,
    openai,
    illustrations,
    tale: tales[0],
    user: users[0],
  }
}
