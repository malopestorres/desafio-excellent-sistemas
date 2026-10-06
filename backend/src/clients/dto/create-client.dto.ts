import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateClientDto {
  @IsString({ message: 'Razão social deve ser uma string' })
  @IsNotEmpty({ message: 'Razão social é obrigatória' })
  @Length(2, 255, { message: 'Razão social deve ter entre 2 e 255 caracteres' })
  companyName: string;

  @IsString({ message: 'CNPJ deve ser uma string' })
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @Length(14, 18, { message: 'CNPJ deve ter entre 14 e 18 caracteres' })
  cnpj: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;
}