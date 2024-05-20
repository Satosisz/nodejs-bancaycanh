import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";
import { TransactionProductDto } from "./transactionProduct.dto";

export class CreateTransactionDto {

	@ApiProperty()
	@IsOptional()
	tst_user_id?: number;

	@ApiProperty()
	@IsOptional()
	tst_total_money?: number;

	@ApiProperty()
	@IsOptional()
	tst_name?: string;

	@ApiProperty()
	@IsOptional()
	tst_email?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	tst_phone?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	tst_address?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	tst_note?: string;

	@ApiProperty()
	@IsInt()
	@IsOptional()
	tst_status: number;

	@ApiProperty()
	@IsInt()
	@IsOptional()
	tst_type: number;

	@ApiProperty()
	@IsString()
	@IsOptional()
	tst_code: string;

	@ApiProperty()
	@IsOptional()
	products?: TransactionProductDto[];

    created_at: Date = new Date();
    updated_at: Date = new Date();
}
