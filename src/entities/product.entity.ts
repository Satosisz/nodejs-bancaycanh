import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Category } from './category.entity';
import { Orders } from './orders.entity';
import { ProductsImages } from './product-image.entity';
import { Rating } from './rating.entity';

@Index('products_pkey', ['id'], { unique: true })
@Entity('products', { schema: 'public' })
export class Products {
	@PrimaryGeneratedColumn('increment',{name: "id"})
	id: number;

	@Column({ name: 'pro_name', length: 255 })
	pro_name: string | null;

	@Column({ name: 'pro_description', length: 255, nullable: true })
	pro_description: string | null;

	@Column()
	pro_avatar: string;

	@Column({ name: 'pro_slug', nullable: false })
	pro_slug: string | null;

	@Column('text', { name: 'pro_content', nullable: false })
	pro_content: string | null;

	@Column('smallint', { name: 'pro_active', nullable: false, default: 0 })
	pro_active: number | -1;

	@Column('smallint', { name: 'pro_hot', nullable: false, default: 0 })
	pro_hot: number;

	@Column('bigint', { name: 'pro_category', nullable: false })
	pro_category: number;

	@Column('json', { name: 'options', nullable: false })
	options: any;

	@Column('float', { name: 'pro_price', nullable: false, default: 0 })
	pro_price: number;

	@Column('int', { name: 'pro_amount', nullable: false, default: 0})
	pro_amount: number;

	@Column('int', { name: 'pro_review_star', nullable: false, default: 0})
	pro_review_star: number;

	@Column('int', { name: 'pro_review_total', nullable: false, default: 0})
	pro_review_total: number;

	@Column('smallint', { name: 'pro_sale', nullable: false, default: 0 })
	pro_sale: number;

	@Column('bigint', { name: 'user_id', nullable: false, default: 0 })
	user_id: number;


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

	@OneToMany(() => ProductsImages, image => image.product)
	product_images: ProductsImages[];

	@ManyToOne(() => Category, cate => cate.products)
	@JoinColumn({ name: "pro_category", referencedColumnName: "id"})
	category: Category;

	@OneToMany(() => Rating, (rating) => rating.product)
	ratings: Rating[];

	@ManyToOne(() => Orders, o => o.products)
	@JoinColumn({ name: "id", referencedColumnName: "od_product_id"})
	order: Orders;
}
