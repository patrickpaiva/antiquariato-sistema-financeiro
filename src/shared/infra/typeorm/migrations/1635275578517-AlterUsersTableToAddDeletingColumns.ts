import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export default class AlterUsersTableToAddDeletingColumns1635275578517
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
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
    await queryRunner.dropColumns('users', [
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
