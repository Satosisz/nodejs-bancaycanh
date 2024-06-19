import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from "lodash";
import { Orders } from 'src/entities/orders.entity';
import { ProductsImages } from 'src/entities/product-image.entity';
import { Products } from 'src/entities/product.entity';
import { IPaging, Paging } from 'src/helpers/helper';
import { BadRequestException } from 'src/helpers/response/badRequest';
import { ILike, Repository } from 'typeorm';
import CreateProductDto from './dtos/create-product.dto';

@Injectable()
export class ProductService {

	constructor(
		@InjectRepository(Products) private readonly adminProdRepo: Repository<Products>,
		@InjectRepository(ProductsImages) private readonly adminProdImgRepo: Repository<ProductsImages>,
		@InjectRepository(Orders) private readonly orderRepo: Repository<Orders>
	) { }

	async createProduct(products: CreateProductDto) {
		products.updated_at = new Date();
		products.created_at = new Date();
		let newProducts = this.adminProdRepo.create({ ...products });
		delete newProducts.product_images;
		await this.adminProdRepo.save(newProducts);
		if (newProducts && !_.isEmpty(products.product_images)) {
			await this.saveProductImage(newProducts.id, products.product_images);
		}
		return { products: newProducts };
	}

	async getProducts(paging: IPaging, filters: any) {
		let condition: any = {};

		if (!_.isEmpty(filters)) {
			if (filters.name) condition.pro_name = ILike(`%${filters.name}%`);
			if (filters.status) condition.pro_active = filters.status;
			if (filters.category_id) condition.pro_category = filters.category_id;
			if (filters.hot) condition.pro_hot = filters.hot;
			if (filters.id) condition.id = filters.id;
		}
		const [products, total] = await this.adminProdRepo.findAndCount({
			where: condition,
			order: {
				created_at: 'DESC'
			},
			relations: {
				product_images: true,
				category: true
			},
			take: paging.pageSize,
			skip: paging.page * paging.pageSize
		});
		products.forEach(element => {
			element.pro_avatar = process.env.BACKEND_APP_URL + "/api/upload/" + element.pro_avatar
		});
		return { content: products, pageable: new Paging(paging.page, paging.pageSize, total), totalElements: total };
	}

	async show(id: number, condition = {}) {
		var product = await this.adminProdRepo.findOne({
			where: {
				id, ...condition
			},
			relations: {
				product_images: true
			},
		})
		product.pro_avatar = process.env.BACKEND_APP_URL + "/api/upload/" + product.pro_avatar
		return { product: product };
	}


	async update(id: number, product: any) {
		product.pro_amount = parseInt(product.pro_amount)
		let errorData: any = {};
		if (!id) {
			errorData.id = ['Id sản phẩm không đúng định dạng'];
		}
		if (_.isEmpty(product)) {
			errorData.form = ['Form không đúng định dạng'];
		}
		let show = await this.show(id);
		if (_.isEmpty(show)) {
			errorData.product = ['Không tìm thấy sản phẩm'];
		}
		if (!_.isEmpty(errorData)) {
			throw new BadRequestException({ code: 'F0002', message: null, data: errorData });
		}

		const newProducts: any = await this.adminProdRepo.create({ ...product, updated_at: new Date() });
		await this.adminProdRepo.update(id, newProducts);
		if (product.product_images) {
			await this.adminProdImgRepo.delete({ product_id: id });
			await this.saveProductImage(id, product.product_images);
		}
		return await this.show(id);
	}

	async saveProductImage(productId: number, productImages: any) {
		const images = productImages.reduce((newImg: any, img: any) => {
			let obj = {
				name: img.name,
				path: img.path,
				product_id: productId,
				created_at: new Date(),
				updated_at: new Date()
			}
			newImg.push(obj);

			return newImg;
		}, []);
		await this.adminProdImgRepo.createQueryBuilder()
			.insert()
			.into(ProductsImages)
			.values(images)
			.execute();
	}

	async deleteProduct(id: number) {
		await this.adminProdRepo.delete(id);
		await this.adminProdImgRepo.delete({ product_id: id });
		await this.orderRepo.delete({ od_product_id: id });
	}

	async validateCreateProd(formProduct: CreateProductDto) {
		let errorData: any = {};

		if (!formProduct.pro_name || (formProduct.pro_name && formProduct.pro_name.trim() == '')) {
			errorData.name = ['Name is required'];
		}

		// if (!formProduct.avatar || (formProduct.avatar && formProduct.avatar.trim() == '')) {
		// 	errorData.avatar = ['Avatar is required'];
		// }

		if (!formProduct.pro_slug || (formProduct.pro_slug && formProduct.pro_slug.trim() == '')) {
			errorData.slug = ['Slug is required'];
		}

		if (![-1, 1].includes(Number(formProduct.pro_active))) {
			errorData.status = ['Status is invalid'];
		}
		if (![-1, 1].includes(Number(formProduct.pro_hot))) {
			errorData.hot = ['Hot is required'];
		}
		if (!_.isEmpty(errorData)) {
			throw new BadRequestException({ code: 'F0002', message: null, data: errorData });
		}
	}
}
