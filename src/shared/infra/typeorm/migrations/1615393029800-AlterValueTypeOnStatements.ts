import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export default class AlterValueTypeOnStatements1615393029800
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'statements',
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
      'statements',
      'value',
      new TableColumn({
        name: 'value',
        type: 'bigint',
        isNullable: false,
      }),
    )
  }
}
