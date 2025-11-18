import { Controller, Post, Body, UseGuards, Request, Get, ParseIntPipe, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PersonalizadosService } from './personalizados.service';
import { CreatePersonalizadoDto } from './dto/create-personalizado.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/auth.service'; // Reutilizamos la interfaz
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/generated/client/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('personalizados') // Ruta base: /personalizados
@UseGuards(JwtAuthGuard) // Solo usuarios logueados pueden enviar solicitudes
export class PersonalizadosController {
  constructor(private readonly personalizadosService: PersonalizadosService) {}

@Post()
  // ¡AÑADIMOS EL INTERCEPTOR DE MULTER!
  @UseInterceptors(
    FileInterceptor('referencia_img', { // 'referencia_img' debe coincidir con el formData del frontend
      storage: diskStorage({
        destination: './public/uploads/custom', // Carpeta dedicada para pedidos custom
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = file.mimetype.split('/')[1] || 'jpg';
          cb(null, `custom-${uniqueSuffix}.${extension}`);
        },
      }),
    }),
  )
  async create(
    @Body() createPersonalizadoDto: CreatePersonalizadoDto, 
    @UploadedFile() file: Express.Multer.File, // <-- Capturamos la imagen
    @Request() req
  ) {
    const user = req.user as JwtPayload; 

    // 1. Obtenemos la URL de la imagen (o null si no se subió)
    const referenciaImgUrl = file ? `/uploads/custom/${file.filename}` : null;

    // 2. Pasamos la URL al servicio (junto con el DTO)
    return this.personalizadosService.createRequest(
      user.sub, 
      createPersonalizadoDto, 
      referenciaImgUrl
    );
  }

  // (Opcional) Endpoint para que el admin vea todas las solicitudes
  @Get()
  async findAll(@Request() req) {
    return this.personalizadosService.findAll();
  }

  // --- ¡NUEVO ENDPOINT PARA EL DESAFÍO! (Solo Admin) ---
  @Post('quote/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async generateQuote(
    @Param('id', ParseIntPipe) requestId: number,
    @Body() body: { costoSugerido: number, costoDiseno: number }
  ) {
    return this.personalizadosService.generateCustomQuote(
      requestId,
      body.costoSugerido,
      body.costoDiseno
    );
  }
}