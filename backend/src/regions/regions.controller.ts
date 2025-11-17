import { Controller, Get } from '@nestjs/common';
import { RegionsService } from './regions.service';

@Controller('regions')
export class RegionsController {

constructor(private readonly regionsService: RegionsService) {}

@Get() // Esto responde al GET /regions
findAll() {
    return this.regionsService.findAll();
  }
}


