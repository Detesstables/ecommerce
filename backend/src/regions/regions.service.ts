import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.region.findMany({
      orderBy: {
        nombre: 'asc', // Opcional: ordenarlas alfabéticamente
      },
    });
  }
}