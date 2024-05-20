import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Products } from './product.entity';

@Entity('ratings', { schema: 'public' })
export class Rating {
	@PrimaryGeneratedColumn('increment',{name: "id"})
	id: number;

	@Column('text', { name: 'content' })
	r_content: string;

	@Column('smallint', { name: 'number' })
	r_number: number;

	@Column('bigint', { name: 'user_id' })
	r_user_id: number;

	@Column('bigint', { name: 'product_id' })
	r_product_id: number;

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

	@ManyToOne(() => User, (user) => user.ratings)
	@JoinColumn({ name: 'r_user_id', referencedColumnName: 'id' })
	user: User[];

	@ManyToOne(() => Products, (products) => products.ratings)
	@JoinColumn({ name: 'r_product_id', referencedColumnName: 'id' })
	product: Products[];
}
