import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt({ message: 'ID do produto deve ser um número inteiro' })
  @IsNotEmpty({ message: 'ID do produto é obrigatório' })
  productId: number;

  @IsInt({ message: 'Quantidade deve ser um número inteiro' })
  @Min(1, { message: 'Quantidade deve ser maior que zero' })
  quantity: number;
}