import { createTaleObject } from '../utils'
import { fakeGeneratedTale } from './fakes'

describe('formats text into title and body', () => {
  it('creates an array from text', () => {
    const text = fakeGeneratedTale()
    const arrFromText = createTaleObject(text)
    expect(arrFromText).toEqual({
      title: expect.any(String),
      body: expect.any(Array),
    })
  })
})
