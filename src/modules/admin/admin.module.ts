import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductImageModule } from './product-image/product-image.module';
import { CategoryModule } from './category/category.module';
import { SlideModule } from './slide/slide.module';
import { ArticleModule } from './article/article.module';
import { MenuModule } from './menu/menu.module';
import { ProductModule } from './product/product.module';
import { MiddlewareMiddleware } from './middleware/middleware.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ContactModule } from './contact/contact.module';
import { StatisticModule } from './statistic/statistic.module';
import { TransactionModule } from './transaction/transaction.module';
import { RatingModule } from './rating/rating.module';

@Module({
    imports: [
        UserModule,
        SlideModule,
        ProductImageModule,
        CategoryModule,
        RatingModule,
        ArticleModule,
        MenuModule,
        ProductModule,
        JwtModule,
        TransactionModule,
        ContactModule,
        StatisticModule,
    ],
    providers: [],
    controllers: []
})
export class AdminModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(MiddlewareMiddleware)
            .forRoutes('admin');
    }
}
