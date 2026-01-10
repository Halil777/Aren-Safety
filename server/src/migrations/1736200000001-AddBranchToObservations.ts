import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddBranchToObservations1736200000001 implements MigrationInterface {
  private fkName = 'FK_observations_branch';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const branchesTable = await queryRunner.getTable('branches');
    if (!branchesTable) {
      await queryRunner.createTable(
        new Table({
          name: 'branches',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            { name: 'name', type: 'varchar', length: '255', isNullable: false },
            { name: 'description', type: 'text', isNullable: true },
            { name: 'projectId', type: 'uuid', isNullable: false },
            { name: 'tenantId', type: 'uuid', isNullable: false },
            { name: 'createdAt', type: 'timestamp', default: 'now()' },
            { name: 'updatedAt', type: 'timestamp', default: 'now()' },
          ],
          foreignKeys: [
            new TableForeignKey({
              columnNames: ['projectId'],
              referencedTableName: 'projects',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            }),
            new TableForeignKey({
              columnNames: ['tenantId'],
              referencedTableName: 'tenants',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            }),
          ],
        }),
        true,
      );
    }

    const typesTable = await queryRunner.getTable('types');
    if (typesTable) {
      await queryRunner.query(`
        INSERT INTO branches (id, name, description, "projectId", "tenantId", "createdAt", "updatedAt")
        SELECT id, COALESCE("typeName", 'Unnamed branch'), description, "projectId", "tenantId", "createdAt", "updatedAt"
        FROM types
        ON CONFLICT (id) DO NOTHING
      `);
    }

    const observations = await queryRunner.getTable('observations');
    const branchIdExists = observations?.findColumnByName('branchId');
    if (!branchIdExists) {
      await queryRunner.addColumn(
        'observations',
        new TableColumn({
          name: 'branchId',
          type: 'uuid',
          isNullable: true,
        }),
      );
    }

    const fkExists = observations?.foreignKeys.some(fk => fk.name === this.fkName);
    if (!fkExists) {
      await queryRunner.createForeignKey(
        'observations',
        new TableForeignKey({
          name: this.fkName,
          columnNames: ['branchId'],
          referencedTableName: 'branches',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('observations');
    const foreignKey = table?.foreignKeys.find(fk => fk.name === this.fkName);
    if (foreignKey) {
      await queryRunner.dropForeignKey('observations', foreignKey);
    }

    const branchIdExists = table?.findColumnByName('branchId');
    if (branchIdExists) {
      await queryRunner.dropColumn('observations', 'branchId');
    }

    const branchesTable = await queryRunner.getTable('branches');
    if (branchesTable) {
      await queryRunner.dropTable('branches');
    }
  }
}
