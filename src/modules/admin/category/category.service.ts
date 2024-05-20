import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Equal, ILike, Raw, Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/updateCate.dto';
import { CreateCategoryDto } from './dto/createCate.dto';
import { IPaging, Paging } from 'src/helpers/helper';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category)
        private cateRepo: Repository<Category>,
    ) { }

    async getCategories(paging: IPaging, filters: any, req?: any) {
        let conditions = await this.buildConditions(filters);

        const [categories, total] = await this.cateRepo.findAndCount({
            where: conditions,
            order: { created_at: 'DESC' },
            take: paging.pageSize,
            skip: (paging.page * paging.pageSize),
        });
        categories.forEach(element => {
			element.avatar = process.env.BACKEND_APP_URL + "/api/upload/" + element.avatar
		});
        return { content: categories, pageable: new Paging(paging.page, paging.pageSize, total), totalElements: total };
    }

    async getCategoryById(cateId: number): Promise<Category> {
        var category = await this.cateRepo.findOneBy({ id: cateId });
		category.avatar = process.env.BACKEND_APP_URL + "/api/upload/" + category.avatar
        return category;
    }

    async createCategory(data: CreateCategoryDto) {
        console.log(data);

        let newCate = await this.cateRepo.create({
            ...data
        });
        await this.cateRepo.save(newCate);
        return newCate;
    }

    async updateCategory(cateId: number, data: UpdateCategoryDto) {
        await this.cateRepo.update(cateId, data);
        return this.cateRepo.findOneBy({ id: cateId });
    }

    async deleteCategory(cateId: number): Promise<void> {
        await this.cateRepo.delete(cateId)
    }

    async buildConditions(filters: any) {
        const conditions: any = {};
        if (filters.id) conditions.id = filters.id;
        if (filters.c_name) conditions.c_name = ILike(`%${filters.c_name}%`);
        if (filters.status) conditions.status = filters.status;
        if (filters.hot) conditions.hot = filters.hot;

        return conditions;
    }

    async getCategoriesHot(paging: IPaging) {
        const condition: any = {};
        condition.hot = Equal(1);

        const [categories, total] = await this.cateRepo.findAndCount({
            where: condition,
            order: { created_at: 'DESC' },
            take: paging.pageSize,
            skip: ((paging.page - 1) * paging.pageSize)
        });

        return { categories: categories, pageable: new Paging(paging.page, paging.pageSize, total), totalElements: total };
    }

}
