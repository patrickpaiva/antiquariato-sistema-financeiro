import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AlterStatementsTableToChangeHistoryColumns1623957311086
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('statements', [
      new TableColumn({
        name: 'transaction_method',
        type: 'varchar',
        isNullable: false,
      }),
    ])
    await queryRunner.addColumns('statements', [
      new TableColumn({
        name: 'transaction_document',
        type: 'varchar',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('statements', [
      new TableColumn({
        name: 'transaction_method',
        type: 'varchar',
        isNullable: false,
      }),
    ])
    await queryRunner.dropColumns('statements', [
      new TableColumn({
        name: 'transaction_document',
        type: 'varchar',
        isNullable: true,
      }),
    ])
  }
}
