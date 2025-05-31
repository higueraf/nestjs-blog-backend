import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

class InvoiceItemDto {
  @IsOptional()
  @IsInt()
  id?: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

import { PaymentDto } from './payment.dto';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items?: InvoiceItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDto)
  payments?: PaymentDto[];
}

