import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm'

export class AddColumnImportIdtoStatementsTable1630179337853
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'statements',
      new TableColumn({
        name: 'import_id',
        type: 'uuid',
        isNullable: true,
      }),
    )

    await queryRunner.createForeignKey(
      'statements',
      new TableForeignKey({
        name: 'StatementsImports',
        columnNames: ['import_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'imports',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('statements', 'StatementsImports')
    await queryRunner.dropColumns('statements', [
      new TableColumn({
        name: 'import_id',
        type: 'varchar',
        isNullable: true,
      }),
    ])
  }
}
