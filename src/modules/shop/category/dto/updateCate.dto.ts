import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateCategoryDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    c_name: string;

    @IsString()
    @ApiProperty()
    c_cate: string;

    updated_at: Date = new Date();
}
