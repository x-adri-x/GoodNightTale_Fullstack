import { validates } from '@server/utils/validation'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { z } from 'zod'
import { Tale } from './tale'

@Entity()
export class Illustration {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('integer')
  taleId: number

  @ManyToOne(() => Tale, (tale) => tale.illustrations, { onDelete: 'CASCADE' })
  @JoinColumn()
  tale: Tale

  @Column('text')
  prompt: string

  @Column({
    type: 'text',
    nullable: true,
  })
  url: string

  @Column({
    type: 'text',
    nullable: true,
  })
  key: string

  @Column({
    type: 'bool',
    default: false,
  })
  isTemp: boolean

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}

export type IllustrationBare = Omit<Illustration, 'tale'>

export const illustrationSchema = validates<IllustrationBare>().with({
  id: z.number().int().positive(),
  taleId: z.number().positive(),
  prompt: z.string().trim(),
  url: z.string().trim(),
  key: z.string(),
  isTemp: z.boolean(),
  createdAt: z.date(),
})

export const illustrationInsertSchema = illustrationSchema.omit({
  id: true,
  url: true,
  createdAt: true,
  key: true,
})

export const illustrationUpdateSchema = illustrationSchema.pick({
  id: true,
  isTemp: true,
})

export const illustrationUploadSchema = illustrationSchema.pick({
  id: true,
})

export type IllustrationInsert = z.infer<typeof illustrationInsertSchema>
export type IllustrationUpdate = z.infer<typeof illustrationUpdateSchema>
