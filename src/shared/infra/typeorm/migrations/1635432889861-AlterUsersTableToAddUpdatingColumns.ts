import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AlterUsersTableToAddUpdatingColumns1635432889861
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
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
    await queryRunner.dropColumns('users', [
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp with time zone',
        isNullable: false,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', [
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
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp with time zone',
        isNullable: false,
      }),
    ])
  }
}
