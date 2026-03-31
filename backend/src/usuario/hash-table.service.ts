import { Injectable, Logger } from '@nestjs/common';
import { Usuario } from '@prisma/client';

@Injectable()
export class HashTableService {
  private readonly logger = new Logger(HashTableService.name);
  
  // tamanho primo
  private readonly B = 97; 
  
  // buckets inicializados com null
  private tabela: (Usuario | 'DELETADO' | null)[] = new Array(this.B).fill(null);

  //função hash primaria: soma os valores ASCII dos caracteres

  private hashPrimario(chave: string): number {
    let soma = 0;
    for (let i = 0; i < chave.length; i++) {
      soma += chave.charCodeAt(i);
    }
    return soma % this.B;
  }

  // sondagem linear (overflow progressivo)

  private rehash(hk: number, i: number): number {
    return (hk + i) % this.B;
  }

  inserir(usuario: Usuario): number {
    const k = usuario.email; 
    const hk = this.hashPrimario(k);
    
    // tentativas de sondagem linear 
    for (let i = 0; i < this.B; i++) {
      const j = this.rehash(hk, i); 

      // se o bucket estiver livre ou marcado como esvaziado
      if (this.tabela[j] === null || this.tabela[j] === 'DELETADO') {
        this.tabela[j] = usuario; 
        this.logger.log(`Usuário ${k} cacheado no índice ${j} da Tabela Hash`);
        return j;
      }
    }
    
    this.logger.warn(`Tabela Hash cheia! Não foi possível armazenar ${k}`);
    return -1; 
  }

  buscar(email: string): Usuario | null {
    const hk = this.hashPrimario(email);

    for (let i = 0; i < this.B; i++) {
      const j = this.rehash(hk, i);

      if (this.tabela[j] === null) {
        return null;
      }

      const usuario = this.tabela[j] as Usuario;
      if (this.tabela[j] !== 'DELETADO' && usuario.email === email) {
        this.logger.log(`Cache HIT: Usuário ${email} encontrado rapidamente no índice ${j}`);
        return usuario;
      }
    }
    return null;
  }
}