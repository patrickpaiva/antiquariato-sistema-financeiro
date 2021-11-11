import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity('imports')
class Import {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('int')
  bank_number: number

  @Column('int')
  account_number: number

  @Column()
  start_import_date: Date

  @Column()
  end_import_date: Date

  @Column()
  hash: string

  @Column()
  created_by: string

  @CreateDateColumn()
  created_at: Date
}

export default Import
