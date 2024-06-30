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

  @ManyToOne(() => User, (user) => user.tales, { onDelete: 'CASCADE' })
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

  @Column({
    type: 'bool',
    nullable: true,
  })
  isSaved: boolean | null

  @OneToMany(() => Illustration, (illustration) => illustration.tale, {
    cascade: true,
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
    .min(2, 'Tale name must be at least 2 characters long')
    .max(100),
  body: z.array(z.string()),
  keywords: z.array(z.string()),
  isFavorite: z
    .boolean({
      invalid_type_error: 'isFavorite must be a boolean',
    })
    .nullable(),
  isSaved: z
    .boolean({
      invalid_type_error: 'isSaved must be a boolean',
    })
    .nullable(),
})

const talePartialSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Tale name must be at least 2 characters long')
    .max(100)
    .optional(),
  isFavorite: z.boolean().nullable().optional(),
  isSaved: z.boolean().nullable().optional(),
})

export const taleInsertSchema = taleSchema.omit({
  id: true,
  isFavorite: true,
  isSaved: true,
})
export const taleUpdateSchema = talePartialSchema.refine(
  (data) =>
    data.title !== undefined ||
    data.isFavorite !== undefined ||
    data.isSaved !== undefined,
  {
    message: "Either 'title' or 'isFavorite' or 'isSaved' must be present",
  }
)

export type TaleInsert = z.infer<typeof taleInsertSchema>
export type TaleUpdate = z.infer<typeof taleUpdateSchema>
