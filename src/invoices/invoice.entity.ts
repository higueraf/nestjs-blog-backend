// invoice.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Payment } from './payment.entity';
import { Customer } from 'src/customers/customer.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, { eager: true })
  customer: Customer;

  @Column()
  date: Date;

  @Column()
  total: number;

  @ManyToMany(() => Payment, (payment) => payment.invoices)
  @JoinTable({
    name: 'invoices_payments',
    joinColumn: { name: 'invoice_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'payment_id', referencedColumnName: 'id' },
  })
  payments: Payment[];
}
