import fs from 'node:fs'

export default function removeImage(name: string): void {
  const imageName = name

  fs.unlink(imageName, (err) => {
    if (err) {
      throw new Error(`Something went wrong while deleting the image: ${err}`)
    }
  })
}
