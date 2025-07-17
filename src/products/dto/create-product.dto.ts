import { IsString, IsNotEmpty, IsUUID, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  upc_code: string;

  @IsString()
  @IsNotEmpty()
  ean_code: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsNumber()
  @IsNotEmpty()
  unit_price: number;
}
