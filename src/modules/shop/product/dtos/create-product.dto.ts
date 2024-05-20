import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export default class CreateProductDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	pro_name: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	pro_description: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	pro_avatar: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	pro_slug: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	pro_content: string;

	@ApiProperty()
	@IsInt()
	@IsOptional()
	pro_active: number;

	@ApiProperty()
	@IsInt()
	@IsOptional()
	pro_hot: number;

	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	pro_category: number;

	@ApiProperty()
	@IsNotEmpty()
	@Min(0)
	pro_price: number;

	@ApiProperty()
	@IsNotEmpty()
	@Min(0)
	pro_amount: number;

	@ApiProperty()
	@IsOptional()
	is_wholesale: boolean;

	@ApiProperty()
	province_id?: number;

	@ApiProperty()
	district_id?: number;

	@ApiProperty()
	ward_id?: number;

	@ApiProperty()
	sale?: number;

	@ApiProperty()
	user_id?: number;

	created_at?: Date;
	updated_at?: Date;

	@ApiProperty()
	@IsOptional()
	@IsArray()
	product_images?: Object;
}
