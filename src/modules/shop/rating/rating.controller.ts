import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, Request, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RatingService } from './rating.service';
import { HTTP_STATUS, IPaging, Paging, Response, BaseResponse } from 'src/helpers/helper';
import CreateRatingDto from './dto/createRating.dto';
import * as _ from 'lodash';
import { JwtGuard } from 'src/modules/auth/guards/jwt/jwt.guard';

@Controller('rating')
@ApiTags('Shop Ratings')
export class RatingController {

    constructor(
        private ratingService: RatingService
    ) { }

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'success' })
    async getRatings(@Request() req: any) {
        try {
            const filters = await this.buildFilter(req);
            const paging: IPaging = {
                page: req.query.page || 1,
                pageSize: req.query.pageSize || 20
            };
            let ratings = await this.ratingService.getRatings(paging, filters);

            return BaseResponse(HTTP_STATUS.success, ratings, '', 'Successful');

        } catch (e) {
            console.log('get rating list ----------------> ', e.message);
            return BaseResponse(e.status, e.response, e.code || 'E0001', e.message);
        }
    }

    @Get('show/:id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'success' })
    async getRatingById(@Param('id') id: number) {
        try {
            const res = await this.ratingService.getRatingById(id);
            if (!res)
                return BaseResponse(HTTP_STATUS.fail, {}, 'E0001', 'rating does not exist');
            else
                return BaseResponse('success', res, '', 'Successful!');
        } catch (e) {
            return BaseResponse(e.status, e.response, e.code || 'E0001', e.message);
        }
    }

    @Post('store')
    @HttpCode(HttpStatus.OK)
	@UseGuards(JwtGuard)
    @ApiResponse({ status: 200, description: 'success' })
    async createRating(@Request() req: any, @Body() data: CreateRatingDto) {
        try {

            const { id: user_id } = req.user;
            if (_.isEmpty(data)) throw new BadRequestException({code: 'F0001'});
            else {
                data.r_user_id = user_id;
                return BaseResponse(HTTP_STATUS.success, await this.ratingService.createRating(data), '', 'Created successfully!');
            }
        } catch (e) {
            console.log('update category ---------------->', e.message);
            return BaseResponse(e.status, e.response, e.code || 'E0001', e.message);
        }
    }

    // @Put('update/:id')
    // @HttpCode(HttpStatus.OK)
    // @ApiResponse({ status: 200, description: 'success' })
    // async updateRating(@Request() req: any, @Param('id') id: number, @Body() data: UpdateRatingDto) {
    //     try {
    //         const { id: user_id } = req.user;
    //         const check = await this.ratingService.getRatingById(id);
    //         if (!check) return BaseResponse('fail', {}, 'rating does not exist');
    //         if (!data) throw new BadRequestException({code: 'F0001'});
    //         else {
    //             data.user_id = user_id;
    //             data.product_id = check.product_id;
    //             data.updated_at = new Date();
    //             return BaseResponse(HTTP_STATUS.success, await this.ratingService.updateRating(id, data), '', 'Updated successfully!');
    //         }
    //     } catch (e) {
    //         console.log('update category ---------------->', e.message);
    //         return BaseResponse(e.status, e.response, e.code || 'E0001', e.message);
    //     }
    // }

    // @Delete('delete/:id')
    // @HttpCode(HttpStatus.OK)
    // @ApiResponse({ status: 200, description: 'success' })
    // async deleteRating(@Param('id') id: number) {
    //     try {
    //         let rating = await this.ratingService.getRatingById(id);

    //         if (!rating) {
    //             return BaseResponse(HTTP_STATUS.fail, {}, 'E0001', 'rating does not exist!');
    //         } else {
    //             await this.ratingService.deleteRating(id);
    //             return BaseResponse('success', {}, '', 'Deleted successfully!');
    //         }
    //     } catch (e) {
    //         return BaseResponse(e.status, e.response, e.code || 'E0001', e.message);
    //     }
    // }

    async buildFilter(@Request() req: any) {
        const filters = {
            id: req.query.id || null,
            user_id: req.query.user_id || null,
            product_id: req.query.product_id || null,
            number: req.query.number || null,
        };
        return filters;
    }
}
