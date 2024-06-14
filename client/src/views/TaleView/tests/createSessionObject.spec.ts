import { createSessionObject } from '@/utils/helpers'
import { fakeGeneratedTale } from './fakes'

describe('formats text into title and body', () => {
  it('creates an array from text', () => {
    const text = fakeGeneratedTale()
    const arrFromText = createSessionObject(text)
    expect(arrFromText).toEqual({
      title: expect.any(String),
      body: expect.any(Array),
    })
  })
})
