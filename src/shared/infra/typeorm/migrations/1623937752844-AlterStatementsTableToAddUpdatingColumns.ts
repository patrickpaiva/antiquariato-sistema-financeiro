import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AlterStatementsTableToAddUpdatingColumns1623937752844
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('statements', [
      new TableColumn({
        name: 'last_update_by',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'last_update_date',
        type: 'timestamp with time zone',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('statements', [
      new TableColumn({
        name: 'last_update_by',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'last_update_date',
        type: 'timestamp with time zone',
        isNullable: true,
      }),
    ])
  }
}
