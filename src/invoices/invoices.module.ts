
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice } from './invoice.entity';
import { InvoiceItem } from './invoice-item.entity';
import { Payment } from './payment.entity';
import { Customer } from 'src/customers/customer.entity';
import { Product } from 'src/products/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Invoice, InvoiceItem, Payment, Product])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}