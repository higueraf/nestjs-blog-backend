// invoice.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Payment } from './payment.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

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
