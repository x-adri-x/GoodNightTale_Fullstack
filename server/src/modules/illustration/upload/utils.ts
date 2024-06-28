import { Chance } from 'chance'
import config from '@server/config'

const random = config.isCi ? Chance(1) : Chance()

export const generateKey = (prompt: string) => {
  const key = prompt.slice().slice(0, 15).replace(/\s/g, '')
  return key + random.string()
}
