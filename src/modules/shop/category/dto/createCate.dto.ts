import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    c_name: string;

    @IsString()
    @ApiProperty()
    c_cate: string;

    created_at: Date = new Date();
    updated_at: Date = new Date();

}
