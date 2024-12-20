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
    description: string;

    // @IsString()
    @ApiProperty()
    avatar: string | null;

    @IsString()
    @ApiProperty()
    c_slug: string;

    @IsInt()
    @ApiProperty()
    status: number;

    @IsInt()
    @ApiProperty()
    hot: number;

    created_at: Date = new Date();
    updated_at: Date = new Date();

}
