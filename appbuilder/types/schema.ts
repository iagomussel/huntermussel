// /appbuilder/types/schema.ts

/**
 * 1. O Core do Builder
 * Esta interface define a estrutura principal de um Website gerado pela IA ou editado pelo usuário.
 */
export interface Website {
  id: string; // ID único do site no banco de dados
  domain: string | null; // Domínio customizado (ex: meunegocio.com). Null se usar subdomínio gratuito.
  subdomain: string; // Subdomínio na plataforma (ex: padaria-do-joao.app.huntermussel.com)
  name: string; // Nome interno do projeto
  theme: SiteTheme; // Configurações globais de design (cores, fontes)
  pages: Page[]; // Múltiplas páginas do site (Home, Sobre, Contato, etc)
  seo: SEOConfig; // Configurações globais para Google
  createdAt: string; // Data ISO
  updatedAt: string; // Data ISO
}

/**
 * 2. Temas Globais
 * Controla a aparência geral que a IA escolhe com base no nicho.
 */
export interface SiteTheme {
  primaryColor: string; // HEX (ex: #FF5733)
  secondaryColor: string; // HEX
  backgroundColor: string; // HEX
  textColor: string; // HEX
  fontFamilyHeading: string; // ex: 'Inter', 'Playfair Display'
  fontFamilyBody: string; // ex: 'Roboto', 'Open Sans'
  borderRadius: "none" | "sm" | "md" | "lg" | "full"; // Estilo de botões e cards
}

/**
 * 3. Estrutura de Múltiplas Páginas
 * O construtor suporta multipages. Cada página tem sua URL e seus blocos.
 */
export interface Page {
  id: string;
  slug: string; // URL da página (ex: "/" para Home, "/sobre" para About)
  title: string; // Título da aba do navegador
  blocks: Block[]; // A lista ordenada de seções (Hero, Features, etc)
}

/**
 * 4. O Sistema de Blocos (Block Builder)
 * O coração do editor visual e da IA. A IA não cospe HTML, ela cospe objetos Block.
 */
export interface Block {
  id: string; // ID único do bloco para drag and drop
  type: BlockType; // Qual componente React renderizar
  order: number; // Posição na página (0 é o topo)
  props: Record<string, any>; // O conteúdo dinâmico do bloco (textos, imagens, links)
  styles?: CustomBlockStyles; // Overrides específicos de design para este bloco
}

/**
 * Tipos de Blocos Suportados (Catálogo de Componentes)
 */
export type BlockType =
  | "Hero" // Seção principal do topo
  | "Features" // Lista de vantagens/serviços (grid)
  | "Testimonials" // Prova social
  | "Pricing" // Tabelas de preços
  | "FAQ" // Perguntas frequentes (Accordion)
  | "CTA" // Call to Action (Chamada final)
  | "Gallery" // Galeria de fotos
  | "ContactForm" // Formulário de contato
  | "TextMedia"; // Imagem de um lado, texto do outro

/**
 * Estilos específicos de um bloco (Opcional, se o usuário editar no construtor)
 */
export interface CustomBlockStyles {
  paddingTop?: string; // ex: '4rem'
  paddingBottom?: string; // ex: '4rem'
  backgroundColor?: string; // ex: '#FFFFFF'
  alignment?: "left" | "center" | "right";
}

/**
 * Configurações de SEO
 */
export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  ogImage: string | null; // Imagem de preview do link
  favicon: string | null;
}

// ============================================================================
// EXEMPLOS DE ESTRUTURAS "PROPS" ESPERADAS PELOS BLOCOS
// ============================================================================

// Props esperadas para o bloco "Hero"
export interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImageUrl?: string; // Se tiver imagem de fundo
  imageUrl?: string; // Se a imagem for lateral
  layout: "center" | "split-left" | "split-right";
}

// Props esperadas para o bloco "Features"
export interface FeaturesProps {
  title: string; // Título da seção (ex: "Nossos Serviços")
  subtitle?: string;
  items: FeatureItem[];
  columns: 2 | 3 | 4; // Quantas colunas no Grid
}

export interface FeatureItem {
  icon?: string; // Nome do ícone (ex: 'LucideStar')
  title: string;
  description: string;
  imageUrl?: string; // Usado caso o nicho precise de fotos nos serviços (ex: pratos de restaurante)
}
