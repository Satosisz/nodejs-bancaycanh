import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/entities/user-roles.entity';

import { ValidateService } from './services/validate.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			User,
			UserRole
		]),
		JwtModule
	],
	controllers: [UserController],
	providers: [
		UserService,
		ValidateService,
		JwtService
	],
	exports: [
		UserService,
		ValidateService
	]
})
export class UserModule { }
