// src/invoices/dto/payment.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDate,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentMethod } from '../payment-method.enum';

export class PaymentDto {
  @IsOptional()
  @IsString()
  id?: string; // Se incluye por si se actualiza

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}
