import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from './entities/navigation.entity';
import { CreateNavigationDto } from './dto/create-navigation.dto';
import { UpdateNavigationDto } from './dto/update-navigation.dto';

@Injectable()
export class NavigationService {
  constructor(
    @InjectRepository(Navigation)
    private readonly navigationRepo: Repository<Navigation>,
  ) {}

  create(dto: CreateNavigationDto) {
    const entity = this.navigationRepo.create(dto as any);
    return this.navigationRepo.save(entity);
  }

  findAll() {
    return this.navigationRepo.find();
  }

  async findOne(id: number) {
    const entity = await this.navigationRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Navigation ${id} not found`);
    return entity;
  }

  async update(id: number, dto: UpdateNavigationDto) {
    await this.navigationRepo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.navigationRepo.delete(id);
    return { deleted: true, id };
  }
}
