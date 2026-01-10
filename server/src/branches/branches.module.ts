import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { Branch } from './branch.entity';
import { Project } from '../projects/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch, Project])],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService],
})
export class BranchesModule {}
