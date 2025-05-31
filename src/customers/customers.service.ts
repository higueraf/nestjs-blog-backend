import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer | null> {
    try {
      const user = this.customerRepository.create(dto);
      return await this.customerRepository.save(user);
    } catch (err) {
      console.error('Error creating user:', err);
      return null;
    }
  }

  async findAll(options: IPaginationOptions, isActive?: boolean): Promise<Pagination<Customer> | null> {
    try {
      const query = this.customerRepository.createQueryBuilder('user');
      if (isActive !== undefined) {
        query.where('user.isActive = :isActive', { isActive });
      }
      return await paginate<Customer>(query, options);
    } catch (err) {
      console.error('Error retrieving users:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Customer | null> {
    try {
      return await this.customerRepository.findOne({ where: { id } });
    } catch (err) {
      console.error('Error finding user:', err);
      return null;
    }
  }



  async update(id: string, dto: UpdateCustomerDto): Promise<Customer | null> {
    try {
      const user = await this.findOne(id);
      if (!user) return null;

      Object.assign(user, dto);
      return await this.customerRepository.save(user);
    } catch (err) {
      console.error('Error updating user:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Customer | null> {
    try {
      const user = await this.findOne(id);
      if (!user) return null;

      return await this.customerRepository.remove(user);
    } catch (err) {
      console.error('Error deleting user:', err);
      return null;
    }
  }

  
}
