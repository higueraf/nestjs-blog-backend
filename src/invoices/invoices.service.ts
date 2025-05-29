import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { InvoiceItem } from './invoice-item.entity';
import { Payment } from './payment.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Customer } from 'src/customers/customer.entity';

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
  ) {}

  async create(dto: CreateInvoiceDto): Promise<Invoice | null> {
  try {
    const customer = await this.customersRepository.findOne({ where: { id: dto.customerId } });
    if (!customer) return null;

    const invoice = this.invoicesRepository.create({
      customer,
      date: dto.date,
      total: dto.total,
    });

    const savedInvoice = await this.invoicesRepository.save(invoice);

    await this.saveOrUpdateItems(savedInvoice.id, dto.items ?? []);
    await this.updateInvoicePayments(savedInvoice.id, dto.paymentIds ?? []);

    return this.findOne(savedInvoice.id);
  } catch (err) {
    console.error('Error creating invoice:', err);
    return null;
  }
}

 async update(id: number, dto: CreateInvoiceDto): Promise<Invoice | null> {
  try {
    const invoice = await this.invoicesRepository.findOne({ where: { id } });
    if (!invoice) return null;

    if (dto.customerId) {
      const customer = await this.customersRepository.findOne({ where: { id: dto.customerId } });
      if (!customer) return null;
      invoice.customer = customer;
    }

    invoice.date = dto.date ?? invoice.date;
    invoice.total = dto.total ?? invoice.total;

    await this.invoicesRepository.save(invoice);

    await this.saveOrUpdateItems(id, dto.items ?? []);
    await this.updateInvoicePayments(id, dto.paymentIds ?? []);

    return this.findOne(id);
  } catch (err) {
    console.error('Error updating invoice:', err);
    return null;
  }
}


  private async saveOrUpdateItems(invoiceId: string, items: Partial<InvoiceItem>[]) {
    const existingItems = await this.itemsRepository.find({ where: { invoice: { id: invoiceId } } });
    const existingIds = existingItems.map(i => i.id);
    const incomingIds = items.filter(i => i.id).map(i => i.id);

    const toDelete = existingIds.filter(id => !incomingIds.includes(id));
    if (toDelete.length > 0) {
      await this.itemsRepository.delete(toDelete);
    }

    for (const item of items) {
      if (item.id && existingIds.includes(item.id)) {
        await this.itemsRepository.save({ ...item, invoice: { id: invoiceId } });
      } else {
        const newItem = this.itemsRepository.create({ ...item, invoice: { id: invoiceId } });
        await this.itemsRepository.save(newItem);
      }
    }
  }

  private async updateInvoicePayments(invoiceId: string, paymentIds: number[]) {
    const invoice = await this.invoicesRepository.findOne({
      where: { id: invoiceId },
      relations: ['payments'],
    });

    const validPayments = await this.paymentsRepository.findByIds(paymentIds);
    invoice.payments = validPayments || [];

    await this.invoicesRepository.save(invoice);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Invoice> | null> {
    try {
      const queryBuilder = this.invoicesRepository.createQueryBuilder('invoice');
      queryBuilder
        .leftJoinAndSelect('invoice.items', 'items')
        .leftJoinAndSelect('invoice.payments', 'payments');
      return await paginate<Invoice>(queryBuilder, options);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      return null;
    }
  }

  async findOne(id: number): Promise<Invoice | null> {
    try {
      return await this.invoicesRepository.findOne({
        where: { id },
        relations: ['items', 'payments'],
      });
    } catch (err) {
      console.error('Error fetching invoice:', err);
      return null;
    }
  }

  async remove(id: number): Promise<boolean> {
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
