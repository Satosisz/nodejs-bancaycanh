import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcrypt";
import * as _ from "lodash";
import { UserRole } from 'src/entities/user-roles.entity';
import { User } from 'src/entities/user.entity';
import { IPaging, Paging, USER_CONST } from 'src/helpers/helper';
import { BadRequestException } from 'src/helpers/response/badRequest';
import { Like, Not, Repository } from 'typeorm';
import CreateUserDto from './dtos/create-user.dto';
import UpdateUserDto from './dtos/update-user.dto';
import { ValidateService } from './services/validate.service';

@Injectable()
export class UserService {
	public selectColumn = [
		"id", "avatar", "created_at", 'birthday',
		'username',
		'roles', 'gender', 'email', 'gender', 'address',
		'name', 'phone', 'status', 'type', 'updated_at']
	constructor(
		@InjectRepository(User) private readonly admUserRepo: Repository<User>,
		@InjectRepository(UserRole) private readonly admUserRoleRepo: Repository<UserRole>,
		private readonly validateService: ValidateService,
	) {

	}

	async buildCondition(filter: any) {
		let condition: any = {};
		if (filter) {
			if (filter.email && filter.email.trim() != '') condition.email = Like(`%${filter.email.trim()}%`);
			if (filter.phone && filter.phone.trim() != '') condition.phone = Like(`%${filter.phone.trim()}%`);
			if (filter.status) condition.status = filter.status;
			if (filter.id) condition.id = filter.id;
			if (filter.type) condition.type = filter.type;
			if (filter.ignore_id && filter.id != filter.ignore_id) condition.id = Not(filter.ignore_id);
			if (filter.role_id) condition.roles = {
				id: filter.role_id
			}
		}
		return condition;
	}

	async getListsUsers(paging: IPaging, filter: any) {
		const condition: any = await this.buildCondition(filter);

		const [users, total] = await this.admUserRepo.findAndCount({
			where: condition,
			select: [].concat(this.selectColumn),
			order: {
				created_at: 'DESC'
			},
			take: paging.pageSize,
			skip: (paging.page- 1) * paging.pageSize
		});
		users.forEach(element => {
			element.avatar = process.env.BACKEND_APP_URL + "/api/upload/" + element.avatar
		});
		return {
			users: users,
			pageable: new Paging(paging.page, paging.pageSize, total)
		};
	}

	async getByUserNameOrEmail(account: string) {
		const user = await this.admUserRepo.findOne({
			where: [
				{ email: account },
				{ username: account },
			]
		});

		return user;
	}

	async create(userDto: CreateUserDto) {
		await this.validateService.validateUser(userDto, true);

		userDto.status = userDto.status || USER_CONST.USER_STATUS_ACTIVE;
		if (!userDto.type) {
			userDto.type = USER_CONST.USER_ADM;
		}
		if (userDto.birthday) {
			userDto.birthday = new Date(userDto.birthday);
		}
		userDto.created_at = new Date();
		userDto.updated_at = new Date();
		userDto.password = await bcrypt.hash(userDto.password.trim(), 10);
		const newUser = await this.admUserRepo.create({ ...userDto as any });

		const account: any = await this.admUserRepo.save(newUser);

		return account;
	}

	async update(id: number, userDto: UpdateUserDto) {
		await this.validateService.validateUser(userDto);
		if (userDto.birthday) {
			userDto.birthday = new Date(userDto.birthday);
		}

		if (userDto.password) {
			userDto.password = await bcrypt.hash(userDto.password.trim(), 10);
		}
		await this.admUserRepo.update(id, userDto)

		return await this.show(id);
	}

	async show(id: number) {
		return await this.findById(id);
	}

	async findById(id: number) {
		let user = await this.admUserRepo.findOne({
			where: {
				id: id
			},
			select: [].concat(this.selectColumn)
		});
		user.avatar = process.env.BACKEND_APP_URL + "/api/upload/" + user.avatar
		return user;
	}

	async activeUser(id: number, admin: any) {
		const user = await this.findById(id);
		if (_.isEmpty(user)) {
			throw new BadRequestException({ code: 'E0002' });
		}
		user.status = USER_CONST.USER_STATUS_ACTIVE;
		this.admUserRepo.save({ ...user, updated_at: new Date() });

	}

	async activesUser(ids: any, admin: any) {
		if (!_.isEmpty(ids)) {
			ids.map(async (id: number) => {
				await this.activeUser(id, admin);
			})
		}
	}

	async accountLock(id: number, admin: any) {
		const user = await this.findById(id);
		if (_.isEmpty(user)) {
			throw new BadRequestException({ code: 'E0002' });
		}
		user.status = USER_CONST.USER_STATUS_LOCK;
		await this.admUserRepo.save({ ...user, updated_at: new Date() });
	}

	async accountsLock(ids: any, admin: any) {
		if (!_.isEmpty(ids)) {
			ids.map(async (id: number) => {
				await this.accountLock(id, admin);
			});
		}
	}

	async getPermissionByUserId(id: number) {
		return await this.admUserRepo.findOne({
			where: {
				id: id
			},
			// relations: [
			//     'permissions'
			// ]
		})
	}

	async findByUsername(username: string) {

	}
}
