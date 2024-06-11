import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import 'dotenv/config'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const { env } = process

export default authenticatedProcedure
  .input(z.string())
  .query(async ({ input: key }) => {
    const s3 = new S3Client({
      region: env.REGION || 'eu-north-1',
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY || '',
      },
    })

    const get = new GetObjectCommand({
      Bucket: env.BUCKET,
      Key: key,
    })

    try {
      const url = await getSignedUrl(s3, get, { expiresIn: 86400 })
      return url
    } catch (error) {
      if (!(error instanceof Error)) throw error
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Something went wrong while uploading to S3: ${error.message}`,
      })
    }
  })
