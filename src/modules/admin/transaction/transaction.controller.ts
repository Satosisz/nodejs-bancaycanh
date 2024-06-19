import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtGuard } from 'src/modules/auth/guards/jwt/jwt.guard';
import * as _ from 'lodash';
import { BadRequestException } from 'src/helpers/response/badRequest';
import { BaseResponse, HTTP_STATUS, IPaging } from 'src/helpers/helper';
import { ApiTags } from '@nestjs/swagger';

@Controller('admin/transaction')
@ApiTags('Admin Transaction')
@UseGuards(JwtGuard)
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) { }

	@Post('store')
	async create(@Request() req: any, @Body() createTransactionDto: CreateTransactionDto) {
		try {
			if(_.isEmpty(createTransactionDto)) {
				throw new BadRequestException({code: 'F0001'});
			}

			const user = req.user;

			return BaseResponse(HTTP_STATUS.success, await this.transactionService.create(createTransactionDto, user),'', 'successfully');
		} catch (error) {
			console.log('e@createProduct----> ', error);
			return BaseResponse(error.status, error.response, error.code || 'E0001', error.message);
		}
	}

	@Get('')
	async findAll(@Request() req: any) {


		try {
			let paging: IPaging = {
				page: req.query.page || 0,
				pageSize: req.query.pageSize || 20,
			};
			let filter = {
				product_name: req.query.product_name || null,
				user_id: req.query.user_id || null,
				tst_name: req.query.tst_name || null,
				tst_email: req.query.tst_email || null,
				tst_phone: req.query.tst_phone || null,
				tst_status: req.query.tst_status || null,
			}
			return BaseResponse(HTTP_STATUS.success, await this.transactionService.findAll(paging, filter),'', 'successfully');
		} catch (error) {
			console.log('e@createProduct----> ', error);
			return BaseResponse(error.status, error.response, error.code || 'E0001', error.message);
		}
	}

	@Get('show/:id')
	async findOne(@Param('id') id: string) {
		try {

			return BaseResponse(HTTP_STATUS.success, await this.transactionService.findOne(Number(id)),'', 'successfully');
		} catch (error) {
			console.log('e@findOne Transaction----> ', error);
			return BaseResponse(error.status, error.response, error.code || 'E0001', error.message);
		}
	}

	@Put('update/:id')
	async update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
		try {
			let transaction = await this.transactionService.findOne(Number(id));
			if(_.isEmpty(transaction)) {
				throw new BadRequestException({code: 'OR0002', message:'Not found transaction by Id'});
			}
			return BaseResponse(HTTP_STATUS.success, await this.transactionService.update(Number(id), updateTransactionDto),'', 'successfully');
		} catch (error) {
			console.log('e@findOne Transaction----> ', error);
			return BaseResponse(error.status, error.response, error.code || 'E0001', error.message);
		}
	}

	@Delete('delete/:id')
	remove(@Param('id') id: string) {
		return this.transactionService.remove(+id);
	}
}
