import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export default class AlterGeneralEntriesTableToChangeDeletedColumnType1615474769203
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'general_entries',
      'deleted',
      new TableColumn({
        name: 'deleted',
        type: 'boolean',
        default: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'general_entries',
      'deleted',
      new TableColumn({
        name: 'deleted',
        type: 'varchar',
        isNullable: true,
      }),
    )
  }
}
