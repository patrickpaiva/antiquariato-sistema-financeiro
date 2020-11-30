import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export default class CreateStatement1606394174983
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'statements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'bank_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'account_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'transaction_type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'transaction_history',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'transaction_method',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'entry_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('statements')
  }
}
