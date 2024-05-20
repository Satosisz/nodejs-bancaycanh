import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export default class CreateUserDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	email: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	username: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(20)
	password: string;

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
	phone: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	avatar: string;

	@ApiProperty()
	@IsOptional()
	birthday?: Date;

	@ApiProperty()
	@IsInt()
	@IsOptional()
	status: number | 1;

	@ApiProperty()
	@IsInt()
	@IsOptional()
	type: number | 1;

	@ApiProperty()
	@IsOptional()
	@IsArray()
	roles?: number[];

	created_at: Date = new Date();
	updated_at: Date = new Date();
}
