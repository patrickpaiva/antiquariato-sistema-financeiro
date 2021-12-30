import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm'

import User from '@modules/users/infra/typeorm/entities/User'
import GeneralEntry from '@modules/generalEntries/infra/typeorm/entities/GeneralEntry'
import Account from '@modules/accounts/infra/typeorm/entities/Account'

@Entity('statements')
class Statement {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('date')
  date: Date

  @Column('int')
  bank_number: number

  @Column('int')
  account_number: number

  @Column()
  transaction_type: string

  @Column('bigint')
  value: number

  @Column()
  transaction_history: string

  @Column()
  transaction_document: string

  @Column({ type: 'text', nullable: true })
  entry_id?: string | null

  @OneToOne(() => GeneralEntry, generalEntry => generalEntry.statement_id)
  generalEntry: GeneralEntry

  @Column()
  created_by: string

  @Column()
  created_manually: boolean

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  user: User

  @ManyToOne(() => Account, account => account.statements, { eager: true })
  account: Account

  @Column()
  deleted: boolean

  @Column()
  deleted_by: string

  @Column()
  deleted_date: Date

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  last_update_date: Date

  @Column()
  last_update_by: string

  @Column()
  import_id: string
}

export default Statement
