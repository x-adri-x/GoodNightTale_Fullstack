import { extractPromptsForIllustrations } from '../helpers'
import { fakePrompts } from './fakes'

describe('extracts illustration prompts', () => {
  it('returns array of prompts', async () => {
    const prompts = fakePrompts()
    const extracted = extractPromptsForIllustrations(prompts)
    expect(extracted).toHaveLength(2)
    expect(extracted).toEqual([expect.any(String), expect.any(String)])
  })
})
