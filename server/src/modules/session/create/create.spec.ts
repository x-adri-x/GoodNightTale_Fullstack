import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import setupTest from '@server/modules/tests/setup'
import { fakeSession } from '@server/entities/tests/fakes'
import { UpdateResult } from 'typeorm'
import sessionRouter from '..'

const createCaller = createCallerFactory(sessionRouter)

it('saves a tale into session', async () => {
  // ARRANGE
  const { db, user } = await setupTest()
  const { create } = createCaller(authContext({ db }, user))
  const session = fakeSession({
    userId: user.id,
    title: 'Fake session',
    body: ['once', 'upon', 'a time'],
  })

  // ACT
  const created = await create(session)

  // ASSERT
  expect(created).toMatchObject({
    id: expect.any(Number),
    title: 'Fake session',
    body: ['once', 'upon', 'a time'],
    keys: expect.any(Array),
    urls: expect.any(Array),
    keywords: expect.any(Array),
    prompts: expect.any(Array),
    userId: user.id,
    createdAt: expect.any(Date),
  })
})

it('updates the saved session tale if user already has one', async () => {
  // ARRANGE
  const { db, user } = await setupTest()
  const { create, get } = createCaller(authContext({ db }, user))
  const session1 = fakeSession({
    userId: user.id,
    title: 'Fake session 1',
    body: ['once', 'upon', 'a time'],
  })

  const session2 = fakeSession({
    userId: user.id,
    title: 'Fake session 2',
    body: ['there', 'was', 'a rabbit'],
  })

  await create(session1)
  const updatedSession = (await create(session2)) as UpdateResult

  const updated = await get()

  expect(updatedSession.affected).toEqual(1)
  expect(updated).toMatchObject({
    id: expect.any(Number),
    title: 'Fake session 2',
    body: ['there', 'was', 'a rabbit'],
    keys: expect.any(Array),
    urls: expect.any(Array),
    userId: user.id,
    createdAt: expect.any(Date),
  })
})
