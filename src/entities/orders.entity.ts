import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Transactions } from './transaction.entity';
import { Products } from './product.entity';

@Index('orders_pkey', ['id'], { unique: true })
@Entity('orders', { schema: 'public' })
export class Orders {
	@PrimaryGeneratedColumn('increment',{name: "id"})
	id: number;

	@Column({ name: 'od_transaction_id', nullable: false, default: 0 })
	od_transaction_id: number;

	@Column({ name: 'od_product_id', nullable: false, default: 0 })
	od_product_id: number;

	@Column({ name: 'od_sale', nullable: false, default: 0 })
	od_sale: number;

	@Column({ name: 'od_qty', nullable: false, default: 0 })
	od_qty: number;

	@Column({ name: 'od_price', nullable: false, default: 0 })
	od_price: number;

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

	@OneToOne(() => Products, t => t.order)
	@JoinColumn({ name: "od_product_id", referencedColumnName: "id"})
	products: Products;

	@ManyToOne(() => Transactions, t => t.orders)
	@JoinColumn({ name: "od_transaction_id", referencedColumnName: "id"})
	transactions: Transactions[];
}
