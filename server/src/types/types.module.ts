import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { BranchesController } from './branches.controller';
import { TypeEntity } from './type.entity';
import { Project } from '../projects/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeEntity, Project])],
  controllers: [TypesController, BranchesController],
  providers: [TypesService],
})
export class TypesModule {}
