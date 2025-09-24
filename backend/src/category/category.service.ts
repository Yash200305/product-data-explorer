import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  create(dto: CreateCategoryDto) {
    const entity = this.categoryRepo.create(dto as any);
    return this.categoryRepo.save(entity);
  }

  findAll() {
    return this.categoryRepo.find();
  }

  async findOne(id: number) {
    const entity = await this.categoryRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Category ${id} not found`);
    return entity;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.categoryRepo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.categoryRepo.delete(id);
    return { deleted: true, id };
  }
}
