import { authContext } from '@tests/utils/context'
import { fakeTale, fakeUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { Tale, User } from '@server/entities'
import taleRouter from '..'

const createCaller = createCallerFactory(taleRouter)

it('sets a new title for the tale', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const { create, update } = createCaller(authContext({ db }, user))

  const tale = fakeTale({
    title: 'Original title',
  })

  // ACT (When)
  const created = await create(tale)

  const updated = await update({
    taleId: created.id,
    title: 'Updated title',
  })

  expect(updated.affected).toEqual(1)

  const taleUpdated = await db.getRepository(Tale).findOneBy({ id: created.id })
  // ASSERT (Then)
  expect(taleUpdated?.title).toEqual('Updated title')
})

it('sets the tale as favorite', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const { create, update } = createCaller(authContext({ db }, user))

  const tale = fakeTale({
    isFavorite: false,
  })

  // ACT (When)
  const created = await create(tale)

  const updated = await update({
    taleId: created.id,
    isFavorite: true,
  })

  expect(updated.affected).toEqual(1)

  const taleUpdated = await db.getRepository(Tale).findOneBy({ id: created.id })
  // ASSERT (Then)
  expect(taleUpdated?.isFavorite).toEqual(true)
})

it('throws an error if tale is not found', async () => {
  // ARRANGE (Given)
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const { create, update } = createCaller(authContext({ db }, user))

  const tale = fakeTale({
    title: 'Original title',
  })

  // ACT (When)
  const created = await create(tale)
  // ACT (When) & ASSERT (Then)
  await expect(
    update({
      taleId: created.id + 12345,
      ...tale,
      title: 'Updated title',
    })
  ).rejects.toThrow(/not found/i)
})
