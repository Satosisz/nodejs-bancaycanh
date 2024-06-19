import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Orders } from 'src/entities/orders.entity';
import { Products } from 'src/entities/product.entity';
import { Transactions } from 'src/entities/transaction.entity';
import { IPaging, Paging } from 'src/helpers/helper';
import { BadRequestException } from 'src/helpers/response/badRequest';
import { MailService } from 'src/modules/mail/mail.service';
import { ILike, Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionProductDto } from './dto/transactionProduct.dto';

@Injectable()
export class TransactionService {
	constructor(
		@InjectRepository(Orders) private readonly orderRepo: Repository<Orders>,
		@InjectRepository(Products) private readonly productRepo: Repository<Products>,
		@InjectRepository(Transactions) private readonly transRepo: Repository<Transactions>,
		private readonly productService: ProductService,
		private mailService: MailService
	) { }

	async create(createTransactionDto: CreateTransactionDto, user: any) {
		let products = createTransactionDto.products || null;
		const rs = await this.countProduct(products);
		delete createTransactionDto.products;
		createTransactionDto.tst_user_id = user.id;
		createTransactionDto.tst_code = 'SA' + this.makeid(5);
		const newTrans: any = this.transRepo.create(createTransactionDto);
		await this.transRepo.save(newTrans);
		await this.storeOrder(products, newTrans.id);

		return newTrans;
	}

	async countProduct(products: any) {
		let totalDiscount = 0;
		let totalPrice = 0;
		if (_.isEmpty(products)) {
			throw new BadRequestException({ code: 'OR0001', message: 'products not empty' });
		}

		for (let item of products) {

			let product: any = await this.productRepo.findOne({
				where: {
					id: Number(item.od_product_id),
					pro_active: 1
				}
			});
			if (_.isEmpty(product)) {
				throw new BadRequestException({ code: 'OR0001', message: `Product id ${item.id} not found or not active` });
			}
			if (Number(item.od_qty) > Number(product.pro_amount)) {
				throw new BadRequestException({ code: 'OR0001', message: `Quantity of product id ${item.id} too much` });
			}
			item.od_price = product.pro_price;

			item.od_sale = (Number(product?.pro_sale) / 100) * Number(product.pro_price) * Number(item.od_qty);
			item.name = product.pro_name;
			item.total_price = (Number(product.pro_price) * Number(item.od_qty) - item.od_sale);
			totalDiscount += item.od_sale;
			totalPrice += item.od_sale;
		}
		return { products, totalDiscount, totalPrice };

	}

	async storeOrder(data: TransactionProductDto[], transId: number) {
		console.log(data)
		for (let item of data) {
			const newTrans = await this.orderRepo.create(
				{
					...item,
					created_at: new Date(),
					updated_at: new Date(),
					od_transaction_id: transId
				});
			await this.orderRepo.save(newTrans);
		}

	}

	async findAll(paging: IPaging, filter: any) {
		let condition: any = {};
		if (filter) {
			// if (filter.product_name) condition.transactions = {
			// 	name: ILike(`%${filter.product_name.trim()}%`)
			// };
			if (filter.tst_status) condition.tst_status = filter.tst_status;
			if (filter.tst_type) condition.tst_type = filter.tst_type;
			if (filter.tst_name) condition.tst_name = ILike(`%${filter.tst_name}%`);
			if (filter.tst_email) condition.tst_email = ILike(`%${filter.tst_email}%`);
			if (filter.tst_phone) condition.tst_phone = ILike(`%${filter.tst_phone}%`);
		}
		const [orders, total] = await this.transRepo.findAndCount({
			where: condition,
			order: {
				created_at: 'DESC'
			},
			relations: {
				user: true,
				orders: true
			},
			take: paging.pageSize,
			skip: paging.page * paging.pageSize
		});
		return { orders: orders, pageable: new Paging(paging.page, paging.pageSize, total), totalElements: total };
	}

	async findOne(id: number) {
		return await this.transRepo.findOne({
			where: { id: id },
			relations: {
				user: true,
				orders: true
			}
		});
	}

	update(id: number, updateTransactionDto: UpdateTransactionDto) {
		return `This action updates a #${id} order`;
	}

	remove(id: number) {
		return `This action removes a #${id} order`;
	}

	async webhook(req: any, res: any) {
		let id = req.query.vnp_TxnRef;
		console.log("order id------> ", id);
		if (req.query.vnp_ResponseCode == "00") {
			// req.query.vnp_ResponseCode === "00" thanh toán thành công
			const order = await this.findOne(id);
			console.log("order=======> ", order);
			// order.status = 2 ;
			order.tst_status = 1;// Đã thanh toán;
			order.tst_type = 1;// Đã thanh toán;
			if (order) {
				this.mailService.sendOrderData(order)
			}

			return res.redirect(process.env.URL_REDIRECT_FE + '/payment/success');
		}

		return res.redirect(process.env.URL_REDIRECT_FE + '/payment/error');
		// return res.status(200).json({ data: req.query, status: 200 });
	}

	makeid(length) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
		  counter += 1;
		}
		return result;
	}
}
