import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export default class CreateFKsforEntries1606400398275
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'general_entries',
      new TableForeignKey({
        name: 'GeneralEntryStatement',
        columnNames: ['statement_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'statements',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    )

    await queryRunner.createForeignKey(
      'general_entries',
      new TableForeignKey({
        name: 'GeneralEntryCreatedByUser',
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    )

    await queryRunner.createForeignKey(
      'general_entries',
      new TableForeignKey({
        name: 'GeneralEntryAuthorizedByUser',
        columnNames: ['authorized_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    )

    await queryRunner.createForeignKey(
      'statements',
      new TableForeignKey({
        name: 'StatementsGeneralEntry',
        columnNames: ['entry_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'general_entries',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('general_entries', 'GeneralEntryStatement')
    await queryRunner.dropForeignKey(
      'general_entries',
      'GeneralEntryCreatedByUser',
    )
    await queryRunner.dropForeignKey(
      'general_entries',
      'GeneralEntryAuthorizedByUser',
    )
    await queryRunner.dropForeignKey('statements', 'StatementsGeneralEntry')
  }
}
