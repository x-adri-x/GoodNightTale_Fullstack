import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import setupTest from '@server/modules/tests/setup'
import { Tale } from '@server/entities'
import illustrationRouter from '..'

const createCaller = createCallerFactory(illustrationRouter)

it('sets a new prompt and url for the illustration if both are provided', async () => {
  // ARRANGE (Given)
  const { db, user, tale } = await setupTest()
  const taleWithIllustration = await db.getRepository(Tale).findOne({
    where: { id: tale.id },
    relations: ['illustrations'],
  })

  const illustration = {
    id: taleWithIllustration?.illustrations[0].id!,
    url: 'Updated illustration url.',
    prompt: 'Updated prompt for illustration.',
  }

  const { update } = createCaller(authContext({ db }, user))

  // ACT (When)
  const illustrationUpdated = await update(illustration)

  // ASSERT (Then)
  expect(illustrationUpdated).toMatchObject({
    id: illustration.id,
    url: 'Updated illustration url.',
    prompt: 'Updated prompt for illustration.',
  })
})

it('updates the url', async () => {
  const { db, user, illustrations } = await setupTest()
  const { update } = createCaller(authContext({ db }, user))

  const illustrationToUpdate = {
    ...illustrations[0],
    url: 'Updated url',
  }

  const updated = await update({
    id: illustrationToUpdate.id,
    prompt: illustrationToUpdate.prompt,
    url: illustrationToUpdate.url,
  })
  expect(updated.url).toBe('Updated url')
})

it('updates isTemp value', async () => {
  const { db, user, illustrations } = await setupTest()
  const { update } = createCaller(authContext({ db }, user))

  const updated = await update({
    id: illustrations[0].id,
    url: 'https://faketown.com/fakeIllustration?id=1',
    isTemp: true,
  })
  expect(updated.isTemp).toBe(true)
})

it('throws an error if illustration is not found', async () => {
  // ARRANGE (Given)
  const {
    db,
    illustrations: [illustration],
    user,
  } = await setupTest()
  const { update } = createCaller(authContext({ db }, user))

  // ACT (When) & ASSERT (Then)
  await expect(
    update({
      id: illustration.id + 12345,
      url: 'https://faketown.com/fakeIllustration?id=1',
    })
  ).rejects.toThrow(/not found/i)
})

it('adds createdAt when updating illustration', async () => {
  const { db, user, illustrations } = await setupTest()
  const { update } = createCaller(authContext({ db }, user))

  const updated = await update({
    id: illustrations[0].id,
    url: 'https://faketown.com/fakeIllustration?id=1',
  })
  expect(updated.createdAt).toStrictEqual(expect.any(Date))
})
