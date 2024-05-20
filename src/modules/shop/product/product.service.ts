import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from "lodash";
import { ProductsImages } from 'src/entities/product-image.entity';
import { Products } from 'src/entities/product.entity';
import { IPaging, Paging } from 'src/helpers/helper';
import { BadRequestException } from 'src/helpers/response/badRequest';
import { ILike, MoreThan, Repository } from 'typeorm';
import CreateProductDto from './dtos/create-product.dto';

@Injectable()
export class ProductService {

	constructor(
		@InjectRepository(Products) private readonly productRepo: Repository<Products>,
		@InjectRepository(ProductsImages) private readonly adminProdImgRepo: Repository<ProductsImages>
	) { }

	async createProduct(products: CreateProductDto) {
		// products.updated_at = new Date();
		// products.created_at = new Date();
		// let newProducts = this.productRepo.create({ ...products });
		// delete newProducts.product_images;
		// await this.productRepo.save(newProducts);
		// if (newProducts && !_.isEmpty(products.product_images)) {
		// 	await this.saveProductImage(newProducts.id, products.product_images);
		// }
		// return { products: newProducts };
		return null;
	}

	async getProducts(paging: IPaging, filters: any) {
		let condition: any = {};
		if (filters?.name && filters?.name?.trim() != '') condition.pro_name = ILike(`%${filters.name}%`);
		condition.pro_active = 1;
		if (filters?.category_id) condition.pro_category = filters.category_id;
		if (filters?.is_hot) condition.pro_hot = 1;
		if (filters?.is_sale) condition.pro_sale = MoreThan(0);
		let order: any = {
			updated_at: 'ASC'
		};
		if (filters?.order == "1") {
			order = {
				pro_price: 'DESC'
			}
		} else if (filters?.order == "2") {
			order = {
				pro_price: 'ASC'
			}
		}
		else if (filters?.order == "3") {
			order = {
				updated_at: 'DESC'
			}
		}

		const [products, total] = await this.productRepo.findAndCount({
			where: condition,
			order: order,
			relations: {
				product_images: true,
				category: true
			},
			take: paging.pageSize,
			skip: ((paging.page - 1) * paging.pageSize)
		});
		products.forEach(element => {
			element.pro_avatar = process.env.BACKEND_APP_URL + "/api/upload/" + element.pro_avatar
		});
		return { content: products, pageable: new Paging(paging.page, paging.pageSize, total), totalElements: total };
	}

	async show(id: number) {
		var product = await this.productRepo.findOne({
			where: {
				id
			},
			relations: {
				product_images: true
			},
		});
		product.pro_avatar = process.env.BACKEND_APP_URL + "/api/upload/" + product.pro_avatar
		return product;

	}


	async update(id: number, product: any) {
		// let errorData: any = {};
		// if (!id) {
		// 	errorData.id = ['Id sản phẩm không đúng định dạng'];
		// }
		// if (_.isEmpty(product)) {
		// 	errorData.form = ['Form không đúng định dạng'];
		// }
		// let show = await this.show(id);
		// if (_.isEmpty(show)) {
		// 	errorData.product = ['Không tìm thấy sản phẩm'];
		// }
		// if (!_.isEmpty(errorData)) {
		// 	throw new BadRequestException({ code: 'F0002', message: null, data: errorData });
		// }
		// const newProducts: any = await this.productRepo.create({ ...product, updated_at: new Date() });
		// await this.productRepo.update(id, newProducts);
		// if (newProducts.product_images) {
		// 	await this.adminProdImgRepo.delete({ product_id: id });
		// 	await this.saveProductImage(id, newProducts.product_images);
		// }
		// return await this.show(id);
		return null
	}

	async saveProductImage(productId: number, productImages: any) {
		const images = productImages.reduce((newImg: any, img: any) => {
			newImg.push({
				name: img.name,
				path: img.path,
				product_id: productId,
				created_at: new Date(),
				updated_at: new Date()
			});
			return newImg;
		}, []);
		await this.adminProdImgRepo.createQueryBuilder()
			.insert()
			.into(ProductsImages)
			.values(images)
			.execute();
	}

	async deleteProduct(id: number) {
		// await this.productRepo.delete(id);
		// await this.adminProdImgRepo.delete({ product_id: id });
		return null
	}

	async validateCreateProd(formProduct: CreateProductDto) {
		let errorData: any = {};

		if (!formProduct.pro_name || (formProduct.pro_name && formProduct.pro_name.trim() == '')) {
			errorData.name = ['Name is required'];
		}

		if (!formProduct.pro_avatar || (formProduct.pro_avatar && formProduct.pro_avatar.trim() == '')) {
			errorData.avatar = ['Avatar is required'];
		}

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
