import { PrismaClient, CategoriasNome } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Seeding Corrigido ---');

  const usuario = await prisma.usuario.upsert({
    where: { email: 'admin@stockio.com' },
    update: {},
    create: {
      email: 'admin@stockio.com',
      userName: 'admin_andre',
      nome: 'André Admin',
      senhaHash: '123456', 
    },
  });

  const catMercado = await prisma.categoria.upsert({
    where: { nome: CategoriasNome.MERCADO },
    update: {},
    create: {
      nome: CategoriasNome.MERCADO,
      subcategorias: {
        create: [{ nome: 'Hortifruti' }, { nome: 'Padaria' }]
      }
    },
    include: { subcategorias: true }
  });

  const subId = catMercado.subcategorias[0].id;

  const loja = await prisma.loja.upsert({
    where: { nome: 'Mercado do André' },
    update: {},
    create: {
      nome: 'Mercado do André',
      descricao: 'O melhor mercado do projeto EDA!',
      usuarioId: usuario.id,
      categoriaId: catMercado.id,
      logo: 'https://via.placeholder.com/150',
    },
  });

  const produtos = [
    {
      nome: 'Maçã Argentina',
      descricao: 'Maçã vermelha tipo exportação',
      preco: 10.50,
      estoque: 100,
      lojaId: loja.id,
      subcategoriaId: subId,
    },
    {
      nome: 'Pão Francês',
      descricao: 'Pão quentinho saindo agora',
      preco: 0.50,
      estoque: 200,
      lojaId: loja.id,
      subcategoriaId: subId,
    }
  ];

  for (const p of produtos) {
    await prisma.produto.create({
      data: p
    });
  }

  console.log('--- Seeding Finalizado com Sucesso! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });