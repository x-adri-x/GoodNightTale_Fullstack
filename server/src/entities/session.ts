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
import { User } from './user'

@Entity()
export class Session {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('integer')
  userId: number

  @ManyToOne(() => User, (user) => user.tales)
  @JoinColumn()
  user: User

  @Column('text')
  title: string

  @Column({
    type: 'text',
    array: true,
  })
  body: Array<String>

  @Column({
    type: 'text',
    array: true,
  })
  illustrations: Array<String>

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}

export type SessionBare = Omit<Session, 'user' | 'createdAt'>

export const sessionSchema = validates<SessionBare>().with({
  id: z.number().int().positive(),
  userId: z.number().positive(),
  title: z
    .string()
    .trim()
    // with a friendly error message
    .min(2, 'Tale name must be at least 2 characters long')
    .max(100),
  body: z.array(z.string()),
  illustrations: z.array(z.string()),
})

export const sessionInsertSchema = sessionSchema.omit({
  id: true,
  userId: true,
})
export const sessionUpdateSchema = sessionSchema.omit({
  id: true,
  userId: true,
})

export type SessionInsert = z.infer<typeof sessionInsertSchema>
export type SessionUpdate = z.infer<typeof sessionUpdateSchema>
