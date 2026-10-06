import { IsString, IsEmail, Length, IsOptional } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString({ message: 'Razão social deve ser uma string' })
  @Length(2, 255, { message: 'Razão social deve ter entre 2 e 255 caracteres' })
  companyName?: string;

  @IsOptional()
  @IsString({ message: 'CNPJ deve ser uma string' })
  @Length(14, 18, { message: 'CNPJ deve ter entre 14 e 18 caracteres' })
  cnpj?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;
}