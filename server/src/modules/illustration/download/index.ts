import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import 'dotenv/config'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import provideRepos from '@server/trpc/provideRepos'
import { Illustration } from '@server/entities/illustration'

const { env } = process

export default authenticatedProcedure
  .input(z.number())
  .use(provideRepos({ Illustration }))
  .query(async ({ input, ctx: { repos } }) => {
    const s3 = new S3Client({
      region: env.REGION || 'eu-north-1',
      credentials: {
        accessKeyId: env.S3_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: env.S3_AWS_SECRET_ACCESS_KEY || '',
      },
    })

    const illustration = await repos.Illustration.findOneBy({ id: input })

    if (!illustration) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Illustration id not recognized.',
      })
    }

    const get = new GetObjectCommand({
      Bucket: env.BUCKET,
      Key: illustration.key,
    })

    try {
      const url = await getSignedUrl(s3, get, { expiresIn: 86400 })
      await repos.Illustration.update({ id: input }, { url })
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error
      } else {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Something went wrong while uploading to S3`,
        })
      }
    }
  })
