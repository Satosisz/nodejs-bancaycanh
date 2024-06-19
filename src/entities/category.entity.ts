import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Products } from './product.entity';

@Entity('category', { schema: 'public' })
export class Category {
	@PrimaryGeneratedColumn('increment',{name: "id"})
	id: number;

	@Column({ name: 'c_name', length: 255 })
	c_name: string | null;

	@Column({ name: 'c_slug', nullable: false })
	c_slug: string | null;

	@Column({ name: 'c_cate', nullable: false })
	c_cate: string | null;

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

	@OneToMany(() => Products, (products) => products.category)
	@JoinColumn([{ name: "id", referencedColumnName: "pro_category" }])
    products: Products[];
}
