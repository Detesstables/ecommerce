import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// Esta ruta de importación es la correcta según nuestro último plan
import { PrismaClient } from 'src/generated/client/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger('Prisma-project');

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Database connected');
        } catch (error) {
            this.logger.error('Failed to connect to the database', error);
            
            // ¡AQUÍ ESTÁ EL ARREGLO!
            // 'throw Error' era un error de sintaxis.
            // 'throw error;' relanza el error original que atrapaste.
            throw error; 
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Database disconnected');
    }
}