import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface CnpjApiResponse {
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  email?: string;
  estabelecimento?: {
    email?: string;
  };
}

@Injectable()
export class CnpjService {
  private readonly logger = new Logger(CnpjService.name);
  private readonly baseUrl = 'https://publica.cnpj.ws/cnpj';

  constructor(private readonly httpService: HttpService) {}

  async findByCnpj(cnpj: string): Promise<CnpjApiResponse> {
    const cleanCnpj = cnpj.replace(/[^\d]/g, '');

    try {
      const response = await firstValueFrom(
        this.httpService.get<CnpjApiResponse>(`${this.baseUrl}/${cleanCnpj}`),
      );
      const data = response.data;

      return {
        razao_social: data.razao_social || data.nome_fantasia || '',
        cnpj: cleanCnpj,
        email: data.email || data.estabelecimento?.email || '',
        nome_fantasia: data.nome_fantasia,
        estabelecimento: data.estabelecimento,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erro ao consultar CNPJ ${cleanCnpj}: ${message}`);
      throw error;
    }
  }
}
