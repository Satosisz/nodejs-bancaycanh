import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Products } from './product.entity';

@Index('product_images_pkey', ['id'], { unique: true })
@Entity('product_images', { schema: 'public' })
export class ProductsImages {
	@PrimaryGeneratedColumn('increment',{name: "id"})
	id: number;

	@Column()
	al_name: string | null;

	@Column()
	al_slug: string | null;

	@Column()
	product_id: number;

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

	@ManyToOne(() => Products, product => product.product_images)
	@JoinColumn([{ name: "product_id", referencedColumnName: "id"}])
	product: Products;
}
