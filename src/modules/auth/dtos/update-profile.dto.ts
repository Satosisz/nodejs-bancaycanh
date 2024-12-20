import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {

	@ApiProperty()
	@IsString()
	@IsOptional()
	name?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	password?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	address?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	gender?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	phone?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	avatar?: string;

	@ApiProperty()
	@IsOptional()
	birthday?: Date;

	updated_at = new Date();
}
