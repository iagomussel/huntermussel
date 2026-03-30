# 🚀 AppBuilder: Construtor de Landing Pages com IA

Esta documentação descreve a arquitetura, as regras de negócios e os detalhes técnicos do **AppBuilder**, um SaaS de criação de sites baseados em blocos gerados por Inteligência Artificial e hospedados em uma infraestrutura Multi-Tenant no Cloudflare Pages.

---

## 1. Visão Geral do Produto

O AppBuilder permite que usuários sem conhecimento técnico criem sites e landing pages profissionais de altíssima conversão digitando apenas um prompt (ex: *"Crie um site para minha padaria artesanal em São Paulo"*). 

A plataforma foca em **simplicidade** e **velocidade**:
- **Geração por IA:** A IA não escreve código HTML. Ela gera uma estrutura **JSON determinística** que nosso motor React renderiza.
- **Edição Visual:** O usuário pode clicar e editar os textos e imagens gerados.
- **Publicação Instantânea:** Não há tempo de "build". O site é servido na mesma hora via Edge Computing.
- **Domínios Customizados:** O usuário assina um plano ($8/mês) para apontar seu domínio próprio (ex: `www.padariadojoao.com.br`), gerenciado via Cloudflare for SaaS.

---

## 2. Arquitetura e Tech Stack

- **Framework Principal:** Next.js (App Router)
- **Hospedagem & Edge:** Cloudflare Pages (via `@cloudflare/next-on-pages`)
- **Estilização:** Tailwind CSS + Radix UI (Componentes acessíveis e sem estilo pré-definido)
- **Banco de Dados:** Cloudflare D1 (SQL no Edge) ou Supabase (PostgreSQL)
- **Inteligência Artificial:** OpenAI API (GPT-4o-mini com "Structured Outputs")
- **Pagamentos:** Stripe (Checkout e Billing Portal)

---

## 3. O Motor de Blocos (JSON Schema)

O coração do sistema é o esquema JSON definido em `/types/schema.ts`. Em vez de salvar HTML sujo ou código espaguete no banco de dados, nós salvamos um "estado" do site.

### Por que usar JSON e não HTML?
1. **Segurança:** Evita ataques de XSS, pois não injetamos HTML bruto, apenas renderizamos propriedades do React de forma segura.
2. **Design Consistente:** A IA não consegue "quebrar" o layout do site. Ela é forçada a usar nossos blocos de alta conversão pré-programados.
3. **Fácil Edição:** É trivial criar um painel (Dashboard) que lê um JSON e altera a cor de um botão ou o texto de um título.

### Exemplo de Estrutura:
```json
{
  "theme": { "primaryColor": "#FF5733", "fontFamilyHeading": "Inter" },
  "pages": [
    {
      "slug": "/",
      "blocks": [
        {
          "type": "Hero",
          "props": { "headline": "Pães quentinhos toda manhã", "ctaText": "Ver Cardápio" }
        }
      ]
    }
  ]
}
```

---

## 4. Multi-Tenancy e Roteamento de Domínios

Nós usamos um **único projeto Next.js** para servir tanto o painel do SaaS quanto os milhares de sites dos clientes. Isso é feito de forma invisível usando o `middleware.ts`.

### O Fluxo da Requisição:
1. O visitante acessa `www.padariadojoao.com`.
2. O DNS aponta para nosso Cloudflare Pages.
3. O `middleware.ts` do Next.js roda no Edge e inspeciona o `hostname`.
4. Ele percebe que *não* é `app.huntermussel.com` e reescreve a URL internamente para a pasta secreta `/_sites/www.padariadojoao.com`.
5. A página em `app/_sites/[domain]/page.tsx` consulta o Banco de Dados, pega o JSON do João e renderiza os componentes React.

Isso garante custo de hospedagem marginal (quase 0) e escalabilidade infinita.

---

## 5. Nichos Suportados e Templates

Para garantir que a IA gere resultados de altíssima qualidade, o sistema segmentará a criação por "Nichos". Cada nicho pode ter variações de blocos permitidos e configurações visuais recomendadas.

### 🏪 Negócios Locais (Local Business)
**Público:** Restaurantes, Clínicas, Encanadores, Salões de Beleza, Petshops.
**Blocos Focados:** 
- Hero com Call to Action forte (Botão de WhatsApp).
- Grid de Serviços/Features.
- Prova Social (Testimonials).
- Localização e Horário de Funcionamento.
- Formulário de Contato Direto.

### 🚀 Startups e SaaS
**Público:** Empresas de software, Waitlists (Lista de espera), Lançamentos de produtos.
**Blocos Focados:**
- Hero Moderno com Mockup/Imagem do Produto.
- Tabela de Preços (Pricing).
- FAQ (Perguntas Frequentes em Accordion).
- Integração de Email (Newsletter).

### 🎨 Criadores e Portfólios (Creators)
**Público:** Influenciadores, Designers, Fotógrafos, Freelancers (Estilo Linktree/Bento Grid).
**Blocos Focados:**
- Avatar/Foto de Perfil Destacada.
- Lista de Links Sociais.
- Galeria de Projetos (Imagens).
- TextMedia (Bio e História).

### 📅 Eventos e Info-Produtos
**Público:** Webinars, Cursos Online, Eventos Presenciais.
**Blocos Focados:**
- Contagem Regressiva (Timer).
- Cronograma do Evento.
- Seção de "Quem é o Palestrante/Autor".
- Botão de Compra de Ingresso em Destaque.

---

## 6. O Fluxo de Vida do Usuário

1. **Onboarding Mágico:** O usuário acessa a homepage do SaaS, digita seu nicho e uma descrição.
2. **Geração (Loading Screen):** O backend chama a OpenAI, valida o JSON de retorno e salva no banco atrelado a uma sessão anônima ou nova conta.
3. **O Editor (Aha! Moment):** O usuário é redirecionado para o Editor Visual. Ele vê seu site gerado e pronto. Ele pode clicar em um botão para mudar a cor, ou clicar em um texto para reescrevê-lo.
4. **Publicação Gratuita:** O site fica online em `[nome].app.huntermussel.com`.
5. **Paywall:** O usuário clica em "Adicionar Domínio Próprio". Um modal do Stripe cobra $8.
6. **Deploy de Domínio:** O usuário recebe instruções DNS. Nossa API chama o `Cloudflare for SaaS (Custom Hostnames)` para gerar o SSL automaticamente. O site está live com domínio oficial.