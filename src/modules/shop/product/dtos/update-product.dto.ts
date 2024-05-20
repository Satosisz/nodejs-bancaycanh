import { IsString, IsInt, IsOptional, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
	province_id?: number;

	@ApiProperty()
	district_id?: number;

	@ApiProperty()
	ward_id?: number;

	@ApiProperty()
	pro_sale?: number;

	@ApiProperty()
	user_id?: number;
}
