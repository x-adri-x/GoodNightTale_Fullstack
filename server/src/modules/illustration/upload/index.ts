import { TRPCError } from '@trpc/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import 'dotenv/config'
import axios from 'axios'
import {
  Illustration,
  illustrationUploadSchema,
} from '@server/entities/illustration'
import { taleIdOwnerProcedure } from '@server/trpc/taleIdOwnerProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { Tale } from '@server/entities/tale'

const { env } = process

export default taleIdOwnerProcedure
  .input(illustrationUploadSchema)
  .use(provideRepos({ Tale, Illustration }))
  .mutation(async ({ input, ctx: { authUser, repos } }) => {
    const s3 = new S3Client({
      region: env.REGION || 'eu-north-1',
      credentials: {
        accessKeyId: env.S3_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: env.S3_AWS_SECRET_ACCESS_KEY || '',
      },
    })

    const { taleId, id } = input

    const tale = await repos.Tale.findOne({
      where: { id: taleId },
      relations: ['illustrations'],
    })

    if (tale?.userId !== authUser.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Tale id is not recognized.',
      })
    }

    if (!tale.illustrations.map((i) => i.id).includes(id)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Illustration id not recognized.',
      })
    }

    const illustration = await repos.Illustration.findOneBy({ id })

    const response = await axios.get(illustration!.url, {
      responseType: 'arraybuffer',
    })
    const command = new PutObjectCommand({
      Bucket: env.BUCKET,
      Key: illustration!.key,
      Body: response.data,
      ContentType: response.headers['content-type'],
    })

    try {
      await s3.send(command)
    } catch (error) {
      if (!(error instanceof Error)) throw error
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Something went wrong while uploading to S3: ${error.message}`,
      })
    }
  })
