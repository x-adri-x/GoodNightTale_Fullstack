import https from 'node:https'
import fs from 'node:fs'
import { random } from '@tests/utils/random'

export default function downloadImage(url: string): string {
  const imageUrl = url
  const imageName = `${random.string()}.jpg`

  const file = fs.createWriteStream(imageName)

  https
    .get(imageUrl, (response) => {
      response.pipe(file)

      file.on('finish', () => {
        file.close()
      })
    })
    .on('error', (err) => {
      fs.unlink(imageName, (e) => {
        if (e) {
          throw new Error(`Something went wrong while deleting the image: ${e}`)
        }
      })
      throw new Error(
        `An error has occurred while downloading the image: ${err}`
      )
    })

  return imageName
}
