import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('accounts')
class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  bank_number: number

  @Column('')
  bank_name: string

  @Column()
  agency_number: number

  @Column()
  account_number: number

  @Column('')
  account_type: number

  @Column()
  deleted: boolean

  @Column()
  deleted_by: string

  @Column()
  deleted_date: Date

  @UpdateDateColumn()
  last_update_date: Date

  @Column()
  last_update_by: string

  @CreateDateColumn()
  created_at: Date
}

export default Account
