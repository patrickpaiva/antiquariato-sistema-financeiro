import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'

import Statement from '@modules/statements/infra/typeorm/entities/Statement'

@Entity('general_entries')
class GeneralEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('date')
  date: Date

  @Column()
  description: string

  @Column('bigint')
  value: number

  @Column()
  type: string

  @Column()
  status: string

  @Column()
  cost_center: string

  @Column()
  presentation_rubric: string

  @Column()
  specific_rubric: string

  @Column({ type: 'text', nullable: true })
  statement_id?: string | null

  @OneToOne(() => Statement, statement => statement.entry_id)
  @JoinColumn({ name: 'statement_id' })
  statement: Statement

  @Column()
  created_by: string

  @Column()
  authorized_by: string

  @Column()
  deleted: boolean

  @Column()
  deleted_by: string

  @Column()
  deleted_date: Date

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

export default GeneralEntry
