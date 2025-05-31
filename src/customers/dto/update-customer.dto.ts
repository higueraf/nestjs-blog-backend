import {
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsBoolean,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, {
    message:
      'Phone number must be a valid 10-digit number with optional country code',
  })
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
