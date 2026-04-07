# Stock.io

Número da Lista: Grupo 2<br>
Conteúdo da Disciplina: Busca<br>

## 👥 Equipe - Grupo 2

Dupla responsavel pela implementação dos algoritmos de busca

| Foto | Nome | Matricula |
|---:|---|---|
| <img src="https://github.com/giovannafg.png" alt="Giovanna" width="80" style="border-radius:8px" /> | **[Giovanna Felipe](https://github.com/giovannafg)** | 241038998 |
| <img src="https://github.com/andrehsb.png" alt="Andrei" width="80" style="border-radius:8px" /> | **[André Henrique](https://github.com/andrehsb)** | 241025149 |

## Sobre 
Backend do sistema de Catalogo de produtos e ecommerce, construído com Next.js (App Router) e TypeScript. 


## Screenshots
![Demonstração da Busca](./backend/uploads/loghash.jpeg)
![Demonstração da Busca](./backend/uploads/password.png)
![Demonstração da Busca](./backend/uploads/login.png)

## 🛠️ Tecnologias
| Categoria | Tecnologia |
|---|---|
| Framework | NEST |
| Linguagem | TypeScript |
| HTTP Client | Axios |


## 🚀 Instalação Rápida

```bash
git clone <URL_DO_REPOSITORIO>
cd backend

npm install

npx prisma db push
npx prisma db seed

# rodar projeto
npm run start:dev
```

## 🔒 Variáveis de Ambiente
Crie `.env.local` na raiz (mesmo nível do package.json):

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO?schema=public"
JWT_SECRET="sua_chave_secreta_aqui"
```

## Uso 
Ao acessar a aplicação, o usuário, ainda deslogado, será direcionado para a HomePage e terá acesso à todo o catálogo de produtos, categorias e lojas. 
Após efetuar o login o usuário pode navegar pelo seu perfil para adicionar uma loja, adicionar um produto e adicionar avaliações em outros produtos.

## Outros 
Link para repositório frontend: https://github.com/eda2-2026/Busca_G2_front

Link para vídeo explicativo: https://youtu.be/GpyrYawFntM


## Estruturas de dados implementadas para otimização
O projeto utiliza a estrutura de Tabela Hash para buscar usuários e autenticar suas senhas para efetuar login