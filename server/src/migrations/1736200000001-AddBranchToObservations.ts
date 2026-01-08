import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddBranchToObservations1736200000001 implements MigrationInterface {
  private fkName = 'FK_observations_branch';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'observations',
      new TableColumn({
        name: 'branchId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'observations',
      new TableForeignKey({
        name: this.fkName,
        columnNames: ['branchId'],
        referencedTableName: 'types',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('observations');
    const foreignKey = table?.foreignKeys.find(fk => fk.name === this.fkName);
    if (foreignKey) {
      await queryRunner.dropForeignKey('observations', foreignKey);
    }
    await queryRunner.dropColumn('observations', 'branchId');
  }
}
