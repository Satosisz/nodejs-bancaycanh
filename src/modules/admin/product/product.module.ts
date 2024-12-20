import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/entities/product.entity';
import { ProductsImages } from 'src/entities/product-image.entity';
import { Orders } from 'src/entities/orders.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Products,
			ProductsImages,
			Orders
		])
	],

	providers: [ProductService],
	controllers: [ProductController],
	exports: [ProductService]
})
export class ProductModule { }
