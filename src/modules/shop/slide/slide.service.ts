import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Raw, Repository } from 'typeorm';
import { IPaging, Paging } from 'src/helpers/helper';
import { CreateSlidesDto } from './dto/createSlide.dto';
import { UpdateSlidesDto } from './dto/updateSlide.dto';
import { Slide } from 'src/entities/slide.entity';

@Injectable()
export class SlideService {

    constructor(
        @InjectRepository(Slide)
        private slideRepo: Repository<Slide>,
    ) { }

    async getSlides(paging: IPaging, filters: any, req?: any) {
        let conditions = await this.buildConditions(filters);

        const [slides, total] = await this.slideRepo.findAndCount({
            where: conditions,
            order: { created_at: 'DESC' },
            take: paging.pageSize,
            skip: paging.page * paging.pageSize
        });

        slides.forEach(element => {
            element.avatar = process.env.BACKEND_APP_URL + "/api/upload/" + element.avatar
        });
        return { slides: slides, pageable: new Paging(paging.page, paging.pageSize, total), totalElements: total }
    }

    async getSlideById(id: number): Promise<Slide> {
        var slide = await this.slideRepo.findOneBy({ id: id })
        slide.avatar = process.env.BACKEND_APP_URL + "/api/upload/" + slide.avatar
        return slide;
    }

    async createSlide(data: CreateSlidesDto) {
        let newSlide = await this.slideRepo.create({
            ...data
        });
        await this.slideRepo.save(newSlide);
        return newSlide;
    }

    async updateSlide(id: number, data: UpdateSlidesDto) {
        await this.slideRepo.update(id, data);
        return this.slideRepo.findOneBy({ id: id });
    }

    async deleteSlide(id: number): Promise<void> {
        await this.slideRepo.delete(id)
    }

    async buildConditions(filters: any)
    {
        const conditions: any = {};

        if (filters.id) conditions.id = Equal(filters.id);
        if (filters.name) conditions.name = Raw(alias => `${alias} ILIKE '%${filters.name}%'`);
        if (filters.status) conditions.status = Equal(filters.status);

        return conditions;
    }

}
