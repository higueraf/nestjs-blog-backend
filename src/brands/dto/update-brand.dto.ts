import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBrandDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}