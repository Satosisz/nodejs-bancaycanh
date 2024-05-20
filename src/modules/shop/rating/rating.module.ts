import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/entities/product.entity';
import { Rating } from 'src/entities/rating.entity';
import { User } from 'src/entities/user.entity';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';

@Module({
    imports: [TypeOrmModule.forFeature([
        Rating,
        User,
        Products
    ])
    ],
    controllers: [RatingController],
    providers: [RatingService],
    exports: [TypeOrmModule]
})
export class RatingModule { }
