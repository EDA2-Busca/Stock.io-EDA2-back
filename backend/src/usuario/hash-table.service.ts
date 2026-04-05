import { Injectable, Logger } from '@nestjs/common';
import { Usuario } from '@prisma/client';

@Injectable()
export class HashTableService {
  private readonly logger = new Logger(HashTableService.name);
  
  // tamanho inicial primo
  private B = 97; 
  private readonly LOAD_FACTOR = 0.7; // 70% de carga máxima
  
  // buckets inicializados com null
  private tabela: (Usuario | 'DELETADO' | null)[] = new Array(this.B).fill(null);
  private size = 0; // número de elementos inseridos

  //função hash primaria: soma os valores ASCII dos caracteres

  private hashPrimario(chave: string, tamanho: number = this.B): number {
    let soma = 0;
    for (let i = 0; i < chave.length; i++) {
      soma += chave.charCodeAt(i);
    }
    return soma % tamanho;
  }

  // sondagem linear (overflow progressivo)

  private rehash(hk: number, i: number, tamanho: number = this.B): number {
    return (hk + i) % tamanho;
  }

  // função para encontrar o próximo primo maior que n
  private proximoPrimo(n: number): number {
    let primo = n;
    while (true) {
      let ehPrimo = true;
      for (let i = 2; i <= Math.sqrt(primo); i++) {
        if (primo % i === 0) {
          ehPrimo = false;
          break;
        }
      }
      if (ehPrimo) return primo;
      primo++;
    }
  }

  // rehashing: redimensiona a tabela quando necessário
  private resize(): void {
    const novoTamanho = this.proximoPrimo(this.B * 2);
    const novaTabela: (Usuario | 'DELETADO' | null)[] = new Array(novoTamanho).fill(null);
    const antigoB = this.B;
    this.B = novoTamanho;

    // reinsert all non-null entries
    for (let i = 0; i < antigoB; i++) {
      if (this.tabela[i] && this.tabela[i] !== 'DELETADO') {
        const usuario = this.tabela[i] as Usuario;
        const hk = this.hashPrimario(usuario.email);
        for (let j = 0; j < this.B; j++) {
          const idx = this.rehash(hk, j);
          if (novaTabela[idx] === null) {
            novaTabela[idx] = usuario;
            break;
          }
        }
      }
    }

    this.tabela = novaTabela;
    this.logger.log(`Tabela Hash redimensionada de ${antigoB} para ${this.B}`);
  }

  inserir(usuario: Usuario): number {
    // verificar se precisa redimensionar
    if (this.size / this.B >= this.LOAD_FACTOR) {
      this.resize();
    }

    const k = usuario.email; 
    const hk = this.hashPrimario(k);
    
    // tentativas de sondagem linear 
    for (let i = 0; i < this.B; i++) {
      const j = this.rehash(hk, i); 

      // se o bucket estiver livre ou marcado como esvaziado
      if (this.tabela[j] === null || this.tabela[j] === 'DELETADO') {
        this.tabela[j] = usuario; 
        this.size++;
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