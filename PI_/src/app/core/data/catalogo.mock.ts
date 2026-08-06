import {
  AgendamentoResumo,
  ArtistaCatalogo,
  AvaliacaoArtista,
  FlashTattoo,
  TrabalhoPortfolio,
} from '../../models/catalogo';

export const ARTISTAS: readonly ArtistaCatalogo[] = [
  {
    id: 1,
    nome: 'Lucas Oliveira',
    especialidade: 'Realismo • Black & Grey',
    cidade: 'Rio de Janeiro, RJ',
    avaliacao: 4.9,
    totalAvaliacoes: 128,
    anosExperiencia: 8,
    tatuagensRealizadas: 450,
    clientesAtendidos: 120,
    fotoUrl:
      'https://images.unsplash.com/photo-1605647533135-51b5906087d0?auto=format&fit=crop&w=700&q=80',
    biografia:
      'Especialista em tatuagens realistas em preto e cinza. Apaixonado por transformar ideias em obras de arte na pele.',
    trabalhos: [
      'https://images.unsplash.com/photo-1522687533888-1078974f88ec?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1714787283989-0c9595dcbf90?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1610942933193-8fafd0973f6d?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1714787283995-7817fef1becf?auto=format&fit=crop&w=700&q=80',
    ],
  },
  {
    id: 2,
    nome: 'Mariana Costa',
    especialidade: 'Aquarela • Fine Line',
    cidade: 'São Paulo, SP',
    avaliacao: 4.8,
    totalAvaliacoes: 95,
    anosExperiencia: 6,
    tatuagensRealizadas: 320,
    clientesAtendidos: 98,
    fotoUrl:
      'https://images.unsplash.com/photo-1562259954-bf6c7f31bf60?auto=format&fit=crop&w=700&q=80',
    biografia:
      'Criadora de tatuagens delicadas e coloridas, com técnica de aquarela e traços finos.',
    trabalhos: [
      'https://images.unsplash.com/photo-1645384816403-bf9913531c0d?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1522687533888-1078974f88ec?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1610942933193-8fafd0973f6d?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1729009223965-daa0791bb6e0?auto=format&fit=crop&w=700&q=80',
    ],
  },
  {
    id: 3,
    nome: 'Rafael Santos',
    especialidade: 'Tribal • Traditional',
    cidade: 'Rio de Janeiro, RJ',
    avaliacao: 4.7,
    totalAvaliacoes: 76,
    anosExperiencia: 10,
    tatuagensRealizadas: 580,
    clientesAtendidos: 150,
    fotoUrl:
      'https://images.unsplash.com/photo-1616879564267-a336232e3a95?auto=format&fit=crop&w=700&q=80',
    biografia: 'Com mais de dez anos de experiência, é especializado em tribal e old school.',
    trabalhos: [
      'https://images.unsplash.com/photo-1714787283995-7817fef1becf?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1522687533888-1078974f88ec?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1645384816403-bf9913531c0d?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1714787283989-0c9595dcbf90?auto=format&fit=crop&w=700&q=80',
    ],
  },
  {
    id: 4,
    nome: 'Juliana Lima',
    especialidade: 'Dotwork • Geométrico',
    cidade: 'Curitiba, PR',
    avaliacao: 4.9,
    totalAvaliacoes: 112,
    anosExperiencia: 5,
    tatuagensRealizadas: 290,
    clientesAtendidos: 88,
    fotoUrl:
      'https://images.unsplash.com/photo-1604449325317-4967c715538a?auto=format&fit=crop&w=700&q=80',
    biografia:
      'Geometria e pontilhismo são sua paixão. Cada peça é única e feita com muito cuidado.',
    trabalhos: [
      'https://images.unsplash.com/photo-1610942933193-8fafd0973f6d?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1729009223965-daa0791bb6e0?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1714787283989-0c9595dcbf90?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1714787283995-7817fef1becf?auto=format&fit=crop&w=700&q=80',
    ],
  },
];

export const TRABALHOS_PORTFOLIO: readonly TrabalhoPortfolio[] = [
  {
    id: 1,
    titulo: 'Leão Realista',
    artista: 'Lucas Oliveira',
    estilo: 'Realismo',
    imagemUrl: '/images/portfolio/portfolio-realismo.png',
    descricao:
      'Composição realista em preto e cinza, construída com contraste, textura e sombreamento progressivo.',
    duracao: '6 horas',
    sessoes: 1,
    local: 'Braço',
  },
  {
    id: 2,
    titulo: 'Rosa Fine Line',
    artista: 'Mariana Costa',
    estilo: 'Fine Line',
    imagemUrl: '/images/portfolio/portfolio-fine-line.png',
    descricao: 'Rosa delicada feita com linhas finas, detalhes leves e composição minimalista.',
    duracao: '3 horas',
    sessoes: 1,
    local: 'Antebraço',
  },
  {
    id: 3,
    titulo: 'Olho Geométrico',
    artista: 'Rafael Santos',
    estilo: 'Blackwork',
    imagemUrl: '/images/portfolio/portfolio-blackwork.png',
    descricao:
      'Desenho geométrico de alto contraste, com preenchimentos sólidos e linhas simétricas.',
    duracao: '5 horas',
    sessoes: 1,
    local: 'Panturrilha',
  },
  {
    id: 4,
    titulo: 'Carpa Koi Oriental',
    artista: 'Juliana Lima',
    estilo: 'Oriental',
    imagemUrl: '/images/portfolio/portfolio-oriental.png',
    descricao: 'Cobra de inspiração oriental, com movimento orgânico e acabamento detalhado.',
    duracao: '8 horas',
    sessoes: 2,
    local: 'Coxa',
  },
  {
    id: 5,
    titulo: 'Máscara Oni Blackwork',
    artista: 'Lucas Oliveira',
    estilo: 'Blackwork',
    imagemUrl: '/images/portfolio/portfolio-mascara-oni-blackwork.png',
    descricao:
      'Máscara de inspiração japonesa criada com preto sólido, simetria e detalhes ornamentais.',
    duracao: '7 horas',
    sessoes: 1,
    local: 'Antebraço',
  },
  {
    id: 6,
    titulo: 'Leão da Savana Realista',
    artista: 'Mariana Costa',
    estilo: 'Realismo',
    imagemUrl: '/images/portfolio/portfolio-leao-savana-realismo.png',
    descricao:
      'Leão realista em preto e cinza, acompanhado por uma paisagem de savana e sombreamento detalhado.',
    duracao: '9 horas',
    sessoes: 2,
    local: 'Antebraço',
  },
  {
    id: 7,
    titulo: 'Adaga e Rosa Old School',
    artista: 'Rafael Santos',
    estilo: 'Old School',
    imagemUrl: '/images/portfolio/portfolio-adaga-rosa-old-school.png',
    descricao:
      'Composição tradicional com adaga, rosa, coração e andorinha, usando contornos marcantes e cores sólidas.',
    duracao: '4 horas',
    sessoes: 1,
    local: 'Antebraço',
  },
  {
    id: 8,
    titulo: 'Beija-flor Aquarela',
    artista: 'Juliana Lima',
    estilo: 'Aquarela',
    imagemUrl: '/images/portfolio/portfolio-beija-flor-aquarela.png',
    descricao:
      'Beija-flor com flores, respingos e transições vibrantes inspiradas na técnica de aquarela.',
    duracao: '5 horas',
    sessoes: 1,
    local: 'Antebraço',
  },
];

export const FLASH_TATTOOS: readonly FlashTattoo[] = [
  {
    id: 1,
    titulo: 'Serpente',
    preco: 250,
    tamanho: 'Pequeno',
    imagemUrl: TRABALHOS_PORTFOLIO[1].imagemUrl,
  },
  {
    id: 2,
    titulo: 'Olho Místico',
    preco: 200,
    tamanho: 'Pequeno',
    imagemUrl: TRABALHOS_PORTFOLIO[0].imagemUrl,
  },
  {
    id: 3,
    titulo: 'Leão Mini',
    preco: 300,
    tamanho: 'Médio',
    imagemUrl: TRABALHOS_PORTFOLIO[2].imagemUrl,
  },
  {
    id: 4,
    titulo: 'Rosa Blackwork',
    preco: 180,
    tamanho: 'Pequeno',
    imagemUrl: TRABALHOS_PORTFOLIO[3].imagemUrl,
  },
  {
    id: 5,
    titulo: 'Cobra Geométrica',
    preco: 320,
    tamanho: 'Médio',
    imagemUrl: TRABALHOS_PORTFOLIO[4].imagemUrl,
  },
  {
    id: 6,
    titulo: 'Borboleta',
    preco: 250,
    tamanho: 'Pequeno',
    imagemUrl: TRABALHOS_PORTFOLIO[5].imagemUrl,
  },
  {
    id: 7,
    titulo: 'Estrela Mística',
    preco: 200,
    tamanho: 'Pequeno',
    imagemUrl: TRABALHOS_PORTFOLIO[6].imagemUrl,
  },
  {
    id: 8,
    titulo: 'Dragão Mini',
    preco: 350,
    tamanho: 'Grande',
    imagemUrl: TRABALHOS_PORTFOLIO[7].imagemUrl,
  },
  {
    id: 9,
    titulo: 'Lua & Sol',
    preco: 280,
    tamanho: 'Médio',
    imagemUrl: TRABALHOS_PORTFOLIO[2].imagemUrl,
  },
  {
    id: 10,
    titulo: 'Caveira Floral',
    preco: 300,
    tamanho: 'Médio',
    imagemUrl: TRABALHOS_PORTFOLIO[4].imagemUrl,
  },
];

export const AGENDAMENTOS: readonly AgendamentoResumo[] = [
  {
    id: 1,
    cliente: 'João Silva',
    artista: 'Lucas Oliveira',
    data: '25/08/2026',
    horario: '14:00',
    status: 'Confirmado',
  },
  {
    id: 2,
    cliente: 'Maria Santos',
    artista: 'Mariana Costa',
    data: '26/08/2026',
    horario: '10:00',
    status: 'Pendente',
  },
  {
    id: 3,
    cliente: 'Pedro Almeida',
    artista: 'Rafael Santos',
    data: '27/08/2026',
    horario: '15:00',
    status: 'Confirmado',
  },
  {
    id: 4,
    cliente: 'Ana Clara',
    artista: 'Juliana Lima',
    data: '28/08/2026',
    horario: '11:00',
    status: 'Finalizado',
  },
];

export const AVALIACOES_ARTISTA: readonly AvaliacaoArtista[] = [
  {
    id: 1,
    autor: 'João Silva',
    data: 'Junho de 2026',
    nota: 5,
    comentario:
      'Trabalho incrível. O desenho ficou exatamente como eu imaginava e o atendimento foi excelente.',
  },
  {
    id: 2,
    autor: 'Maria Santos',
    data: 'Maio de 2026',
    nota: 5,
    comentario: 'Ambiente organizado, profissional cuidadoso e resultado acima das expectativas.',
  },
];
