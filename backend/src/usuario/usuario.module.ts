import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { HashTableService } from './hash-table.service';
import { UsuarioController } from './usuario.controller';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    HashTableService
  ],
  exports:[UsuarioService],
})
export class UsuarioModule {}
