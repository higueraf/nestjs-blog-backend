import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Brand } from '../brands/brand.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  model: string;

  @Column()
  year: string;

  @Column()
  color: string;

  @Column()
  plate: string;

  @Column()
  engineType: string;

  @Column()
  transmission: string;

  @Column('uuid')
  brandId: string;

  @ManyToOne(() => Brand, { eager: true })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;
}