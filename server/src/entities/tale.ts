import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { z } from 'zod'
import { Illustration } from './illustration'
import { User } from './user'

@Entity()
export class Tale {
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
  keywords: Array<String>

  @Column({
    type: 'bool',
    nullable: true,
  })
  isFavorite: boolean | null

  @OneToMany(() => Illustration, (illustration) => illustration.tale, {
    cascade: ['insert', 'update', 'remove'],
  })
  illustrations: Illustration[]
}

export type TaleBare = Omit<Tale, 'user' | 'illustrations'>

export const taleSchema = validates<TaleBare>().with({
  id: z.number().int().positive(),
  userId: z.number().positive(),
  title: z
    .string()
    .trim()
    // with a friendly error message
    .min(2, 'Tale name must be at least 2 characters long')
    .max(100),
  body: z.array(z.string()),
  keywords: z.array(z.string()),
  isFavorite: z
    .boolean({
      invalid_type_error: 'isFavorite must be a boolean',
    })
    .nullable(),
})

const talePartialSchema = z.object({
  id: z.number().int().positive(),
  title: z
    .string()
    .trim()
    .min(2, 'Tale name must be at least 2 characters long')
    .max(100)
    .optional(),
  isFavorite: z.boolean().nullable().optional(),
})

export const taleInsertSchema = taleSchema.omit({ id: true, isFavorite: true })
export const taleUpdateSchema = talePartialSchema.refine(
  (data) => data.title !== undefined || data.isFavorite !== undefined,
  {
    message: "Either 'title' or 'isFavorite' must be present",
  }
)

export type TaleInsert = z.infer<typeof taleInsertSchema>
export type TaleUpdate = z.infer<typeof taleUpdateSchema>
