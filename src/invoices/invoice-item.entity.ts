// invoice.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, In, ManyToOne } from 'typeorm';
import { Payment } from './payment.entity';
import { Product } from 'src/products/products.entity';
import { Invoice } from './invoice.entity';

@Entity('invoices')
export class InvoiceItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column()
  unit_price: number;

  @Column()
  subtotal: number;

   @ManyToOne(() => Invoice, { eager: true })
  invoice: Invoice;

  @ManyToOne(() => Product, { eager: true })
   product: Product;
}
