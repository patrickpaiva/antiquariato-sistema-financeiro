import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export default class AlterStatementsTableToAddDeletingColumns1615833137384
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('statements', [
      new TableColumn({
        name: 'deleted',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'deleted_by',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'deleted_date',
        type: 'date',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('statements', [
      new TableColumn({
        name: 'deleted',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'deleted_by',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'deleted_date',
        type: 'date',
        isNullable: true,
      }),
    ])
  }
}
