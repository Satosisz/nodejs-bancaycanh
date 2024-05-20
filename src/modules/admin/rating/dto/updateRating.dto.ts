import { IsString, IsInt, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateRatingDto {

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	r_content: string;

	@ApiProperty()
	@IsInt()
	@IsOptional()
	r_number: number;

	@ApiProperty()
	@IsInt()
	@IsOptional()
	r_user_id: number;

	@ApiProperty()
	@IsInt()
	@IsOptional()
	r_product_id: number;

	updated_at: Date = new Date();
}
