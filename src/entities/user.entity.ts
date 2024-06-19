import {
    Column,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Rating } from './rating.entity';
// import { Article } from './article.entity';
import { Transactions } from './transaction.entity';

@Index('users_email_unique', ['email'], { unique: true })
@Entity('users', { schema: 'public' })
export class User {
	@PrimaryGeneratedColumn('increment', { name: "id" })
	id: number;

	@Column({ name: 'name', length: 255, nullable: false })
	name: string;

	@Column({ name: 'email', length: 255, nullable: false })
	email: string;

	@Column({ name: 'username', length: 255, nullable: false })
	username: string;

	@Column({ name: 'password', nullable: false })
	password: string;

	@Column({ name: 'address', nullable: false })
	address: string;

	@Column('enum',
		{
			name: 'gender',
			nullable: true,
			enum: ['male', 'female', 'other'],
		})
	gender: string;

	@Column({ name: 'phone', nullable: true })
	phone: string;

	@Column({ name: 'avatar', nullable: true })
	avatar: string;

	@Column('date', { name: 'birthday', nullable: true })
	birthday: Date;

	@Column('smallint', { name: 'status', nullable: true, default: 0 })
	status: number | -1;

	@Column('smallint', { name: 'type', nullable: true, default: 0 })
	type: number | -1;

	@Column('timestamp', {
		name: 'created_at',
		default: () => 'now()',
	})
	created_at: Date;

	@Column('timestamp', {
		name: 'updated_at',
		nullable: true,
		default: () => 'now()',
	})
	updated_at: Date;

	@OneToMany(() => Rating, (rating) => rating.user)
	ratings: Rating[];

	// @OneToMany(() => Article, article => article.user)
	// article: Article[];

	@OneToMany(() => Transactions, o => o.user)
	transaction: Transactions[];

}
