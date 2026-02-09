# Editor de Blog (local)

Interface estilo Notion para criar, editar e gerenciar os artigos em Markdown da pasta `src/content/blog/` do projeto. Os arquivos são lidos e salvos diretamente nessa pasta; o frontend do site (Vite) usa os mesmos arquivos no próximo build.

## Requisitos

- Python 3.10+
- Chave da API OpenAI (opcional; só é necessária para "Gerar com IA" e "Melhorar texto")

## Instalação

```bash
cd tools/blog-editor
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Configuração

Copie o exemplo de ambiente e preencha se for usar IA:

```bash
cp .env.example .env
# Edite .env e defina OPENAI_API_KEY=sk-...
```

## Uso

Na pasta `tools/blog-editor`, com o venv ativado:

```bash
python app.py
```

Acesse: **http://127.0.0.1:5000**

- **Sidebar**: lista de artigos (ordenados por data de modificação). Clique para abrir.
- **Novo artigo**: cria um `.md` em `src/content/blog/` com frontmatter (title, date, description) e corpo em Markdown.
- **Salvar**: grava alterações no mesmo arquivo.
- **Gerar com IA**: envia um prompt à OpenAI e acrescenta o texto gerado ao corpo do artigo (requer `OPENAI_API_KEY`).
- **Melhorar texto**: envia o corpo atual à OpenAI com uma instrução opcional e substitui pelo texto melhorado.

Os arquivos ficam em `huntermussel/src/content/blog/*.md`. O build do site (`npm run build`) inclui esses arquivos automaticamente.
