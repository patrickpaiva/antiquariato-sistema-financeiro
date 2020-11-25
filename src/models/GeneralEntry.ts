import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

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

  @Column()
  statement_id: string

  @Column()
  created_by: string

  @Column()
  authorized_by: string

  @Column('timestamp with time zone')
  created_at: Date

  @Column('timestamp with time zone')
  updated_at: Date
}

export default GeneralEntry
