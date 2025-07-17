import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRoleField1752769874432 implements MigrationInterface {
    name = 'AddUserRoleField1752769874432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "unit_price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "unit_price" numeric(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "unit_price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "unit_price" integer NOT NULL`);
    }

}
