import { HashTableService } from './src/usuario/hash-table.service';

const hashTable = new HashTableService();

console.log('Memória antes de inserir usuários:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB');

// Simular inserção de 100 usuários fictícios (mais que 97 para testar resize)
for (let i = 0; i < 100; i++) {
  const usuario = {
    id: i,
    userName: `user${i}`,
    nome: `Nome ${i}`,
    email: `user${i}@example.com`,
    senhaHash: 'hashedpassword',
    fotoPerfil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  hashTable.inserir(usuario as any);
}

console.log('Memória após inserir 100 usuários:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB');

// Testar busca
const encontrado = hashTable.buscar('user25@example.com');
console.log('Usuário encontrado:', encontrado ? encontrado.email : 'Não encontrado');