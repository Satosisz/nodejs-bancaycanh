import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from 'src/entities/rating.entity';
import { User } from 'src/entities/user.entity';
import { Products } from 'src/entities/product.entity';

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
