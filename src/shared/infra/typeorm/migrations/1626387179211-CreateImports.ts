import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateImports1626387179211 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'imports',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
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
            name: 'start_import_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'end_import_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'hash',
            type: 'varchar',
            isNullable: false,
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
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('imports')
  }
}
