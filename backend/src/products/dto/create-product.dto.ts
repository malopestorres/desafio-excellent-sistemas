import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  IsOptional,
  IsInt,
  IsPositive,
  Length,
  Matches,
} from 'class-validator';

export class CreateProductDto {
  @IsInt({ message: 'ID deve ser um número inteiro' })
  @IsPositive({ message: 'ID deve ser um número positivo' })
  id: number;

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
  @IsArray({ message: 'Imagens deve ser um array' })
  @IsString({ each: true, message: 'Cada imagem deve ser uma string' })
  @Matches(/^(\/uploads\/|https?:\/\/)/, {
    each: true,
    message: 'Cada imagem deve ser um caminho de upload ou URL válida',
  })
  images?: string[];
}