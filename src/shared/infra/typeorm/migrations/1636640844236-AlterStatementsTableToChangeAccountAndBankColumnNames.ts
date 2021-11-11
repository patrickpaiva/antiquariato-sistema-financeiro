import { MigrationInterface, QueryRunner } from 'typeorm'

export class AlterStatementsTableToChangeAccountAndBankColumnNames1636640844236
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "statements" RENAME COLUMN "bank_id" TO "bank_number"`,
    )
    await queryRunner.query(
      `ALTER TABLE "statements" RENAME COLUMN "account_id" TO "account_number"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "statements" RENAME COLUMN "bank_number" TO "bank_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "statements" RENAME COLUMN "account_number" TO "account_id"`,
    )
  }
}
