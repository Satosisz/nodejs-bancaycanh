import { Body, Controller, Get, Param, Post, Request, Response, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';
import { BaseResponse, HTTP_STATUS, IPaging } from 'src/helpers/helper';
import { BadRequestException } from 'src/helpers/response/badRequest';
import { JwtGuard } from 'src/modules/auth/guards/jwt/jwt.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
@ApiTags('Shop transaction')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) { }

	@Post('store')
	@UseGuards(JwtGuard)
	async create(@Request() req: any, @Body() createTransactionDto: CreateTransactionDto) {
		try {
			if (_.isEmpty(createTransactionDto)) {
				throw new BadRequestException({ code: 'F0001' });
			}
			const user = req.user;

			return BaseResponse(HTTP_STATUS.success,
				await this.transactionService.create(createTransactionDto, user)
				, '', 'successfully');
		} catch (error) {
			console.log('e@createProduct----> ', error);
			return BaseResponse(error.status, error.response, error.code || 'E0001', error.message);
		}
	}

	@Get('')
	@UseGuards(JwtGuard)
	async findAll(@Request() req: any) {

		try {
			let paging: IPaging = {
				page: req.query.page || 0,
				pageSize: req.query.pageSize || 20,
			};
			let filter = {
				product_name: req.query.product_name || null,
				user_id: req.user?.id,
				tst_name: req.query.tst_name || null,
				tst_email: req.query.tst_email || null,
				tst_phone: req.query.tst_phone || null,
				tst_status: req.query.tst_status || null,
				tst_type: req.query.tst_type || null,
			}
			return BaseResponse(HTTP_STATUS.success, await this.transactionService.findAll(paging, filter), '', 'successfully');
		} catch (error) {
			console.log('e@createProduct----> ', error);
			return BaseResponse(error.status, error.response, error.code || 'E0001', error.message);
		}
	}

	@Get('show/:id')
	@UseGuards(JwtGuard)
	findOne(@Param('id') id: string) {
		return this.transactionService.findOne(+id);
	}

	@Get('/callback')
	async webhook(@Request() req: any, @Response() res: any) {
		return await this.transactionService.webhook(req, res);
	}
}
