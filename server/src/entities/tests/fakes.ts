import type { User } from '@server/entities/user'
import type { Tale } from '@server/entities/tale'
import type { Illustration } from '@server/entities/illustration'
import { random } from '@tests/utils/random'

const randomId = () => random.integer({ min: 1, max: 2147483647 })

/**
 * Generates a fake user with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeUser = <T extends Partial<User>>(overrides: T = {} as T) => ({
  id: randomId(),
  email: random.email(),
  password: 'Password.123!',
  ...overrides,
})

/**
 * Generates a fake project with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeTale = <T extends Partial<Tale>>(overrides: T = {} as T) => ({
  id: randomId(),
  title: random.string(),
  body: [random.string(), random.string()],
  keywords: ['foo', 'bar', 'baz'],
  isFavorite: false,
  ...overrides,
})

/**
 * Generates a fake illustration with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeIllustration = <T extends Partial<Illustration>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  prompt: 'A fake prompt.',
  url: random.string(),
  key: random.string(),
  ...overrides,
})
