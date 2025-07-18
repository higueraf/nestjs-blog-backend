import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  upc_code: string;

  @Column()
  ean_code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;



  @ManyToOne(() => Category, { eager: true })
  category: Category;

  @Column({ nullable: true })
  photo: string;
}
