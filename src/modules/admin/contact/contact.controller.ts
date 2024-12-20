import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Request, BadRequestException, Put } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/modules/auth/guards/jwt/jwt.guard';
import { BaseResponse, HTTP_STATUS, IPaging } from 'src/helpers/helper';
import * as _ from 'lodash';

@Controller('admin/contact')
@ApiTags('Admin Contact')
@UseGuards(JwtGuard)
export class ContactController {
	constructor(private readonly contactService: ContactService) { }

	@Post('store')
	async create(@Request() req: any, @Body() createOrderDto: CreateContactDto) {
		try {
			if (_.isEmpty(createOrderDto)) {
				throw new BadRequestException({ code: 'F0001' });
			}
			const user = req.user;
			// return BaseResponse(HTTP_STATUS.success, await this.contactService.create(createOrderDto, user),'', 'successfully');
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
				name: req.query.name || null,
				email: req.query.email || null,
				title: req.query.title || null,
			}
			return BaseResponse(HTTP_STATUS.success, await this.contactService.findAll(paging, filter), '', 'successfully');
		} catch (error) {
			console.log('e@createProduct----> ', error);
			return BaseResponse(error.status, error.response, error.code || 'E0001', error.message);
		}
	}

	@Get('show/:id')
	async findOne(@Param('id') id: string) {
		try {

			return BaseResponse(HTTP_STATUS.success, await this.contactService.findOne(Number(id)), '', 'successfully');
		} catch (error) {
			console.log('e@findOne Order----> ', error);
			return BaseResponse(error.status, error.response, error.code || 'E0001', error.message);
		}
	}

	@Put('update/:id')
	async update(@Param('id') id: string, @Body() updateOrderDto: CreateContactDto) {
		try {
			let order = await this.contactService.findOne(Number(id));
			if (_.isEmpty(order)) {
				throw new BadRequestException({ code: 'OR0002', message: 'Not found order by Id' });
			}
			return BaseResponse(HTTP_STATUS.success, await this.contactService.update(Number(id), updateOrderDto), '', 'successfully');
		} catch (error) {
			console.log('e@findOne Order----> ', error);
			return BaseResponse(error.status, error.response, error.code || 'E0001', error.message);
		}
	}

	@Delete('delete/:id')
	remove(@Param('id') id: string) {
		return this.contactService.remove(+id);
	}
}
