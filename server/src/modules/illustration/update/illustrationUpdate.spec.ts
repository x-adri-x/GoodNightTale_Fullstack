import { authContext, authRepoContext } from '@tests/utils/context'
import { fakeIllustration, fakeUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import setupTest from '@server/modules/tests/setup'
import illustrationRouter from '..'

const createCaller = createCallerFactory(illustrationRouter)

// Example with a mocked database
it('sets a new prompt for the illustration', async () => {
  // ARRANGE (Given)
  const user = fakeUser()
  const illustration = fakeIllustration({
    taleId: 1,
    prompt: 'Updated prompt',
  })

  // Example with a mocked database
  const { update } = createCaller(
    authRepoContext(
      {
        Tale: {
          findOne: () => ({ id: 1, userId: user.id }),
        },
        Illustration: {
          update: () => ({ affected: 1 }),
          findOneByOrFail: () => ({
            ...illustration,
          }),
        },
      },
      user
    )
  )

  // ACT (When)
  const illustrationUpdated = await update(illustration)

  // ASSERT (Then)
  expect(illustrationUpdated).toMatchObject({
    id: illustration.id,
    prompt: illustration.prompt,
  })
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
