import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { InvoiceItem } from './invoice-item.entity';
import { Payment } from './payment.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Customer } from 'src/customers/customer.entity';
import { Product } from 'src/products/products.entity';
import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,

    @InjectRepository(InvoiceItem)
    private itemsRepository: Repository<InvoiceItem>,

    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,

    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateInvoiceDto): Promise<Invoice | null> {
    try {
      const customer = await this.customersRepository.findOne({
        where: { id: dto.customerId },
      });
      if (!customer) return null;

      const invoice = this.invoicesRepository.create({
        customer,
        date: dto.date,
        total: dto.total,
      });

      const savedInvoice = await this.invoicesRepository.save(invoice);

      await this.saveOrUpdateItems(savedInvoice.id, dto.items ?? []);
      await this.saveOrUpdatePayments(savedInvoice.id, dto.payments ?? []);

      return this.findOne(savedInvoice.id);
    } catch (err) {
      console.error('Error creating invoice:', err);
      return null;
    }
  }

  async update(id: string, dto: CreateInvoiceDto): Promise<Invoice | null> {
    try {
      const invoice = await this.invoicesRepository.findOne({ where: { id } });
      if (!invoice) return null;

      if (dto.customerId) {
        const customer = await this.customersRepository.findOne({
          where: { id: dto.customerId },
        });
        if (!customer) return null;
        invoice.customer = customer;
      }

      invoice.date = dto.date ?? invoice.date;
      invoice.total = dto.total ?? invoice.total;

      await this.invoicesRepository.save(invoice);

      await this.saveOrUpdateItems(id, dto.items ?? []);
      await this.saveOrUpdatePayments(id, dto.payments ?? []);

      return this.findOne(id);
    } catch (err) {
      console.error('Error updating invoice:', err);
      return null;
    }
  }

  private async saveOrUpdateItems(invoiceId: string, items: any[]) {
    const existingItems = await this.itemsRepository.find({
      where: { invoice: { id: invoiceId } },
    });
    const existingIds = existingItems.map((i) => i.id);
    const incomingIds = items.filter((i) => i.id).map((i) => i.id);

    const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
    if (toDelete.length > 0) {
      await this.itemsRepository.delete(toDelete);
    }

    for (const item of items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });
      if (!product) continue;

      const itemData = {
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.quantity * item.price,
        product,
        invoice: { id: invoiceId },
      };

      if (item.id && existingIds.includes(item.id)) {
        await this.itemsRepository.save({ ...itemData, id: item.id });
      } else {
        const newItem = this.itemsRepository.create(itemData);
        await this.itemsRepository.save(newItem);
      }
    }
  }

  private async saveOrUpdatePayments(invoiceId: string, payments: PaymentDto[]) {
    const invoice = await this.invoicesRepository.findOne({
      where: { id: invoiceId },
      relations: ['payments'],
    });
    if (!invoice) return;

    const processedPayments: Payment[] = [];

    for (const paymentDto of payments) {
      if (paymentDto.id) {
        const existingPayment = await this.paymentsRepository.findOne({
          where: { id: paymentDto.id },
        });

        if (existingPayment) {
          Object.assign(existingPayment, paymentDto);
          const updated = await this.paymentsRepository.save(existingPayment);
          processedPayments.push(updated);
          continue;
        }
      }

      const newPayment = this.paymentsRepository.create(paymentDto);
      const saved = await this.paymentsRepository.save(newPayment);
      processedPayments.push(saved);
    }

    invoice.payments = processedPayments;
    await this.invoicesRepository.save(invoice);
  }

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<Invoice> | null> {
    try {
      const queryBuilder = this.invoicesRepository
        .createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.customer', 'customer')
        .leftJoinAndSelect('invoice.payments', 'payments');

      return await paginate<Invoice>(queryBuilder, options);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Invoice | null> {
    try {
      return await this.invoicesRepository.findOne({
        where: { id },
        relations: ['customer', 'payments'],
      });
    } catch (err) {
      console.error('Error fetching invoice:', err);
      return null;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.itemsRepository.delete({ invoice: { id } });
      const result = await this.invoicesRepository.delete(id);
      return result.affected !== 0;
    } catch (err) {
      console.error('Error deleting invoice:', err);
      return false;
    }
  }
}
