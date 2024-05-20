import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class TransactionProductDto {


	@ApiProperty()
	@IsOptional()
	id?: number;

	@ApiProperty()
	@IsOptional()
	od_product_id?: number;

	@ApiProperty()
	@IsOptional()
	od_sale?: number;

	@ApiProperty()
	@IsOptional()
	od_qty: number;

	@ApiProperty()
	@IsOptional()
	od_price: number;
}
