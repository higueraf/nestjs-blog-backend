import {
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, {
    message:
      'Phone number must be a valid 10-digit number with optional country code',
  })
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
