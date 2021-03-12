import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'

import User from '@modules/users/infra/typeorm/entities/User'
import GeneralEntry from '@modules/generalEntries/infra/typeorm/entities/GeneralEntry'

@Entity('statements')
class Statement {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('date')
  date: Date

  @Column('int')
  bank_id: number

  @Column('int')
  account_id: number

  @Column()
  transaction_type: string

  @Column('bigint')
  value: number

  @Column()
  transaction_history: string

  @Column()
  transaction_method: string

  @Column({ nullable: true })
  entry_id?: string

  @OneToOne(() => GeneralEntry, generalEntry => generalEntry.statement_id)
  generalEntry: GeneralEntry

  @Column()
  created_by: string

  @Column()
  created_manually: boolean

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  user: User

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

export default Statement
