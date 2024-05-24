import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { fakeTale, fakeUser } from '@server/entities/tests/fakes'
import { User } from '@server/entities'
import { createCallerFactory, router } from '..'
import { taleIdOwnerProcedure } from '.'

const routes = router({
  testCall: taleIdOwnerProcedure.query(() => 'passed'),
})

const db = await createTestDatabase()

const [
  {
    tales: [taleOne],
    ...userOne
  },
  {
    tales: [taleTwo],
  },
] = await db.getRepository(User).save([
  fakeUser({
    tales: [fakeTale()],
  }),
  fakeUser({
    tales: [fakeTale()],
  }),
])

const createCaller = createCallerFactory(routes)
const authenticated = createCaller(authContext({ db }, userOne))

it('passes if tale belongs to the user', async () => {
  const response = await authenticated.testCall({ taleId: taleOne.id })

  expect(response).toEqual('passed')
})

it('throws an error if tale id is not provided', async () => {
  // casting to any to allow calling without type safe input
  await expect((authenticated.testCall as any)({})).rejects.toThrow(/taleId/i)
})

it('throws an error if user provides a non-existing tale id', async () => {
  // casting to any to allow calling without type safe input
  await expect(
    (authenticated.testCall as any)({ taleId: 999 })
  ).rejects.toThrow(/Tale not found/i)
})

it('throws an error if user provides null as tale id', async () => {
  await expect(authenticated.testCall({ taleId: null as any })).rejects.toThrow(
    /Expected number, received null/i
  )
})

it('throws an error if tale does not belong to the user', async () => {
  await expect(authenticated.testCall({ taleId: taleTwo.id })).rejects.toThrow(
    /tale/i
  )
})
