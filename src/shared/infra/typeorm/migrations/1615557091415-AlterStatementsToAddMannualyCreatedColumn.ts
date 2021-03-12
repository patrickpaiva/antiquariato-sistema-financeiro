import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export default class AlterStatementsToAddMannualyCreatedColumn1615557091415
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'statements',
      new TableColumn({
        name: 'created_manually',
        type: 'boolean',
        default: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('statements', 'created_manually')
  }
}
