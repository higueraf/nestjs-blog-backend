import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  plate: string;

  @IsString()
  @IsNotEmpty()
  engineType: string;

  @IsString()
  @IsNotEmpty()
  transmission: string;

  @IsUUID()
  @IsNotEmpty()
  brandId: string;
}