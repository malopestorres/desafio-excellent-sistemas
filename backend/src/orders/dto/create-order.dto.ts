import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto.js';

export class CreateOrderDto {
  @IsInt({ message: 'ID do cliente deve ser um número inteiro' })
  @IsNotEmpty({ message: 'Cliente é obrigatório' })
  clientId: number;

  @IsArray({ message: 'Itens deve ser uma lista' })
  @ArrayMinSize(1, { message: 'Informe ao menos um produto no pedido' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}