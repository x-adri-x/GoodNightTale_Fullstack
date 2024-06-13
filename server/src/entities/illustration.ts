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

  @ManyToOne(() => Tale, (tale) => tale.illustrations)
  @JoinColumn()
  tale: Tale

  @Column('text')
  prompt: string

  @Column('text')
  url: string

  @Column('text')
  key: string

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
  createdAt: z.date(),
})

export const illustrationInsertSchema = illustrationSchema.omit({
  id: true,
  createdAt: true,
})

export const illustrationUpdateSchema = illustrationSchema.omit({
  taleId: true,
  key: true,
  createdAt: true,
})

export type IllustrationInsert = z.infer<typeof illustrationInsertSchema>
export type IllustrationUpdata = z.infer<typeof illustrationUpdateSchema>
