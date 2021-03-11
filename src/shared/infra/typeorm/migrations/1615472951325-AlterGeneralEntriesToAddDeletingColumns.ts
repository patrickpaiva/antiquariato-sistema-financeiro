import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export default class AlterGeneralEntriesToAddDeletingColumns1615472951325
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('general_entries', [
      new TableColumn({
        name: 'deleted',
        type: 'varchar',
        isNullable: true,
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
    await queryRunner.dropColumns('general_entries', [
      new TableColumn({
        name: 'deleted',
        type: 'varchar',
        isNullable: true,
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
