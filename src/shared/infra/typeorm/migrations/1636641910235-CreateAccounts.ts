import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateAccounts1636641910235 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accounts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'bank_number',
            type: 'int',
          },
          {
            name: 'bank_name',
            type: 'varchar',
          },
          {
            name: 'agency_number',
            type: 'int',
          },
          {
            name: 'account_number',
            type: 'int',
          },
          {
            name: 'account_type',
            type: 'int',
          },
          {
            name: 'deleted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'deleted_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'deleted_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'last_update_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'last_update_date',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accounts')
  }
}
