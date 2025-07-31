import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class UpdateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  model?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  year?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  color?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  plate?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  engineType?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  transmission?: string;

  @IsUUID()
  @IsOptional()
  brandId?: string;
}