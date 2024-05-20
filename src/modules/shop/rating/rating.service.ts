import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entities/product.entity';
import { Rating } from 'src/entities/rating.entity';
import { IPaging, Paging } from 'src/helpers/helper';
import { Equal, Repository } from 'typeorm';
import CreateRatingDto from './dto/createRating.dto';
import UpdateRatingDto from './dto/updateRating.dto';

@Injectable()
export class RatingService {

    constructor(
        @InjectRepository(Rating)
        private ratingRepo: Repository<Rating>,
		@InjectRepository(Products)
        private productRepo: Repository<Products>
    ) { }

    async getRatings(paging: IPaging, filters: any) {
        let conditions = await this.buildConditions(filters);

        const [ratings, total] = await this.ratingRepo.findAndCount({
            where: conditions,
            order: { created_at: 'DESC' },
            take: paging.pageSize,
            relations: {
                user: true,
                product: true,
            },
            skip: ((paging.page - 1) * paging.pageSize)
        });

        return { ratings: ratings, pageable: new Paging(paging.page, paging.pageSize, total), totalElements: total }
    }

    async getRatingById(id: number) {
        return await this.ratingRepo.findOneBy({ id: id });
    }

    async createRating(data: CreateRatingDto) {
		let product = await this.productRepo.findOne({
			where: {id: data.r_product_id}
		});
		if(!product) {
			throw new BadRequestException({ code: 'F0002', message: "Không tìm thấy sản phẩm" });
		}
        let newRating = await this.ratingRepo.create({
            ...data
        });
        await this.ratingRepo.save(newRating);
		product.pro_review_star = (product?.pro_review_star || 0) + data.r_number;
		product.pro_review_total = (product?.pro_review_total || 0) + 1;
		await this.productRepo.update(product?.id,{pro_review_star: (product?.pro_review_star || 0) + data.r_number, pro_review_total: (product?.pro_review_total || 0) + 1})
        return newRating;
    }

    async updateRating(id: number, data: UpdateRatingDto) {
        await this.ratingRepo.update(id, data);
        return this.ratingRepo.findOneBy({ id: id });
    }

    async deleteRating(id: number): Promise<void> {
        await this.ratingRepo.delete(id);
    }

    async buildConditions(filters: any)
    {
        const conditions: any = {};

        if (filters.id) conditions.id = Equal(filters.id);
        if (filters.user_id) conditions.r_user_id = Equal(filters.user_id);
        if (filters.product_id) conditions.r_product_id = Equal(filters.product_id);
        if (filters.number) conditions.r_number = Equal(filters.number);

        return conditions;
    }
}
