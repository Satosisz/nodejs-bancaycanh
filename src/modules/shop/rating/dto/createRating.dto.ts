import { IsString, IsInt, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateRatingDto {

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

    created_at: Date = new Date();
    updated_at: Date = new Date();
}
