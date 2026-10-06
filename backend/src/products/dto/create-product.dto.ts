import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Descrição deve ser uma string' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @Length(3, 500, { message: 'Descrição deve ter entre 3 e 500 caracteres' })
  description: string;

  @IsNumber({}, { message: 'Valor de venda deve ser um número' })
  @Min(0.01, { message: 'Valor de venda deve ser maior que zero' })
  salePrice: number;

  @IsNumber({}, { message: 'Estoque deve ser um número' })
  @Min(0, { message: 'Estoque não pode ser negativo' })
  stock: number;

  @IsOptional()
  @IsArray({ message: 'Imagens deve ser um array de URLs' })
  @IsUrl({}, { each: true, message: 'Cada imagem deve ser uma URL válida' })
  images?: string[];
}