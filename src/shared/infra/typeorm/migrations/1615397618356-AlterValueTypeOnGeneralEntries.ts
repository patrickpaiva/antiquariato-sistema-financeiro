import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export default class AlterValueTypeOnGeneralEntries1615397618356
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'general_entries',
      'value',
      new TableColumn({
        name: 'value',
        type: 'int',
        isNullable: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'general_entries',
      'value',
      new TableColumn({
        name: 'value',
        type: 'bigint',
        isNullable: false,
      }),
    )
  }
}
