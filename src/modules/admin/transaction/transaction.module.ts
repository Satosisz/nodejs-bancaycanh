import { Module, forwardRef } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { ProductService } from '../product/product.service';
import { ProductsImages } from 'src/entities/product-image.entity';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { UserRole } from 'src/entities/user-roles.entity';
import { Transactions } from 'src/entities/transaction.entity';
import { Orders } from 'src/entities/orders.entity';
import Mail from 'nodemailer/lib/mailer';
import { MailModule } from 'src/modules/mail/mail.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Products,
			Transactions,
			User,
			ProductsImages,
			Role,
			Permission,
			UserRole,
			Orders,
		]),
		forwardRef(() => MailModule),
	],
	controllers: [TransactionController],
	providers: [TransactionService, ProductService]
})
export class TransactionModule { }
