import { IsString, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty()
  unit_price: number;


}
