import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import setupTest from '@server/modules/tests/setup'
import { Tale } from '@server/entities'
import illustrationRouter from '..'

const createCaller = createCallerFactory(illustrationRouter)

it('sets a new prompt for the illustration', async () => {
  // ARRANGE (Given)
  const { db, user, tale } = await setupTest()
  const taleWithIllustration = await db.getRepository(Tale).findOne({
    where: { id: tale.id },
    relations: ['illustrations'],
  })

  const illustration = {
    taleId: tale.id,
    id: taleWithIllustration?.illustrations[0].id!,
    url: taleWithIllustration?.illustrations[0].url!,
    prompt: 'Updated prompt',
  }

  const { update } = createCaller(authContext({ db }, user))

  // ACT (When)
  const illustrationUpdated = await update(illustration)
  const existing = await db.getRepository(Tale).findOne({
    where: { id: tale.id },
    relations: ['illustrations'],
  })
  if (!existing) {
    throw new Error(`Tale with id ${tale.id} not found`)
  }

  // ASSERT (Then)
  expect(illustrationUpdated).toMatchObject({
    id: illustration.id,
    prompt: illustration.prompt,
  })
})

it('updates the url', async () => {
  // it will need to check that the url is updated
  const { db, user, tale, illustrations } = await setupTest()
  const { update } = createCaller(authContext({ db }, user))

  const illustrationToUpdate = {
    ...illustrations[0],
    url: 'Updated url',
  }

  const updated = await update({
    taleId: tale.id,
    id: illustrationToUpdate.id,
    prompt: illustrationToUpdate.prompt,
    url: illustrationToUpdate.url,
  })
  expect(updated.url).toBe('Updated url')
})

// Example with a database
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
      ...illustration,
      id: illustration.id + 12345,
      prompt: 'Updated prompt',
    })
  ).rejects.toThrow(/not found/i)
})
