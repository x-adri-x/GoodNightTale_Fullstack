import { TRPCError } from '@trpc/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { z } from 'zod'
import 'dotenv/config'
import axios from 'axios'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { Chance } from 'chance'
import config from '@server/config'

const random = config.isCi ? Chance(1) : Chance()
const { env } = process

export default authenticatedProcedure
  .input(z.string())
  .mutation(async ({ input: url }) => {
    const s3 = new S3Client({
      region: env.REGION || 'eu-north-1',
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY || '',
      },
    })

    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const key = random.string()
    const command = new PutObjectCommand({
      Bucket: env.BUCKET,
      Key: key,
      Body: response.data,
      ContentType: response.headers['content-type'],
    })

    try {
      await s3.send(command)
      return key
    } catch (error) {
      if (!(error instanceof Error)) throw error
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Something went wrong while uploading to S3: ${error.message}`,
      })
    }
  })
