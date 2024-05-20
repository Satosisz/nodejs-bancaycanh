import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Orders } from './orders.entity';

@Index('transactions_pkey', ['id'], { unique: true })
@Entity('transactions', { schema: 'public' })
export class Transactions {
	@PrimaryGeneratedColumn('increment',{name: "id"})
	id: number;

	@Column({ type: 'bigint', name: 'tst_user_id', nullable: true, default: 0 })
	tst_user_id: number;

	@Column('float', { name: 'tst_total_money', nullable: false, default: 0 })
	tst_total_money: number;

	@Column({ name: 'tst_name', nullable: true, default: null })
	tst_name: string;

	@Column({ name: 'tst_email', nullable: true, default: null })
	tst_email: string;

	@Column({ name: 'tst_phone', nullable: true, default: null })
	tst_phone: string;

	@Column({ name: 'tst_address', nullable: true, default: null })
	tst_address: string;

	@Column({ name: 'tst_note', nullable: true, default: null })
	tst_note: string;

	@Column('bigint', { name: 'tst_status', nullable: false, default: 0 })
	tst_status: number;

	@Column('int', { name: 'tst_type', nullable: false, default: 0 })
	tst_type: number;

	@Column({ name: 'tst_code', nullable: true, default: null })
	tst_code: string;

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

	@ManyToOne(() => User, user => user.transaction)
	@JoinColumn({ name: "tst_user_id", referencedColumnName: "id"})
	user: User;

	@OneToMany(() => Orders, t => t.transactions)
	@JoinColumn({ name: "order_id", referencedColumnName: "id"})
	orders: Orders[];
}
