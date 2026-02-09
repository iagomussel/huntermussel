"""
Editor de blog local estilo Notion.
Gerencia artigos em Markdown na pasta src/content/blog/ do projeto.
Uso: OPENAI_API_KEY=xxx python app.py
"""
import os
import re
from pathlib import Path

import flask
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = flask.Flask(__name__, static_folder="static", static_url_path="")
app.config["MAX_CONTENT_LENGTH"] = 2 * 1024 * 1024  # 2MB

# Pasta de artigos (relativa ao diretório do projeto huntermussel)
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
CONTENT_DIR = PROJECT_ROOT / "src" / "content" / "blog"
CONTENT_DIR.mkdir(parents=True, exist_ok=True)


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text)
    return text.strip("-") or "sem-titulo"


def path_for_slug(slug: str) -> Path:
    return CONTENT_DIR / f"{slug}.md"


def parse_frontmatter(raw: str) -> tuple[dict, str]:
    if not raw.startswith("---"):
        return {}, raw
    end = raw.index("---", 3) if raw.count("---") >= 2 else 0
    if end == 0:
        return {}, raw
    head = raw[3:end].strip()
    body = raw[end + 3:].lstrip("\n")
    data = {}
    for line in head.split("\n"):
        if ":" in line:
            k, v = line.split(":", 1)
            data[k.strip()] = v.strip().strip('"').strip("'")
    return data, body


def build_content(fm: dict, body: str) -> str:
    lines = ["---"]
    for k, v in fm.items():
        lines.append(f'{k}: "{v}"')
    lines.append("---")
    lines.append("")
    lines.append(body)
    return "\n".join(lines)


@app.route("/")
def index():
    return flask.send_from_directory(app.static_folder, "index.html")


@app.route("/api/articles", methods=["GET"])
def list_articles():
    articles = []
    for f in sorted(CONTENT_DIR.glob("*.md"), key=lambda p: p.stat().st_mtime, reverse=True):
        slug = f.stem
        raw = f.read_text(encoding="utf-8")
        fm, _ = parse_frontmatter(raw)
        articles.append({
            "slug": slug,
            "title": fm.get("title", slug),
            "date": fm.get("date", ""),
            "description": fm.get("description", ""),
        })
    return flask.jsonify(articles)


@app.route("/api/articles/<slug>", methods=["GET"])
def get_article(slug):
    path = path_for_slug(slug)
    if not path.exists():
        return flask.jsonify({"error": "Not found"}), 404
    raw = path.read_text(encoding="utf-8")
    fm, body = parse_frontmatter(raw)
    return flask.jsonify({
        "slug": slug,
        "frontmatter": fm,
        "body": body,
    })


@app.route("/api/articles", methods=["POST"])
def create_article():
    data = flask.request.get_json() or {}
    title = (data.get("title") or "Novo artigo").strip()
    slug = slugify(title)
    path = path_for_slug(slug)
    if path.exists():
        base, n = slug, 1
        while path.exists():
            slug = f"{base}-{n}"
            path = path_for_slug(slug)
            n += 1
    from datetime import date
    fm = {
        "title": title,
        "date": data.get("date") or date.today().isoformat(),
        "description": data.get("description", ""),
    }
    content = build_content(fm, data.get("body", ""))
    path.write_text(content, encoding="utf-8")
    return flask.jsonify({"slug": slug, "path": str(path)})


@app.route("/api/articles/<slug>", methods=["PUT"])
def update_article(slug):
    path = path_for_slug(slug)
    if not path.exists():
        return flask.jsonify({"error": "Not found"}), 404
    data = flask.request.get_json() or {}
    fm = data.get("frontmatter") or {}
    body = data.get("body", "")
    content = build_content(fm, body)
    path.write_text(content, encoding="utf-8")
    return flask.jsonify({"ok": True})


@app.route("/api/articles/<slug>", methods=["DELETE"])
def delete_article(slug):
    path = path_for_slug(slug)
    if not path.exists():
        return flask.jsonify({"error": "Not found"}), 404
    path.unlink()
    return flask.jsonify({"ok": True})


def get_openai():
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        return None
    return OpenAI(api_key=key)


@app.route("/api/ai/generate", methods=["POST"])
def ai_generate():
    client = get_openai()
    if not client:
        return flask.jsonify({"error": "OPENAI_API_KEY não configurada"}), 503
    data = flask.request.get_json() or {}
    prompt = (data.get("prompt") or "").strip()
    if not prompt:
        return flask.jsonify({"error": "prompt obrigatório"}), 400
    try:
        r = client.chat.completions.create(
            model=data.get("model", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": "Você é um redator de blog. Escreva em Markdown, em português. Seja claro e objetivo."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=2000,
        )
        text = r.choices[0].message.content or ""
        return flask.jsonify({"text": text})
    except Exception as e:
        return flask.jsonify({"error": str(e)}), 500


@app.route("/api/ai/improve", methods=["POST"])
def ai_improve():
    client = get_openai()
    if not client:
        return flask.jsonify({"error": "OPENAI_API_KEY não configurada"}), 503
    data = flask.request.get_json() or {}
    text = (data.get("text") or "").strip()
    instruction = (data.get("instruction") or "Melhore o texto mantendo o tom e o conteúdo. Retorne só o texto melhorado, em Markdown.").strip()
    if not text:
        return flask.jsonify({"error": "text obrigatório"}), 400
    try:
        r = client.chat.completions.create(
            model=data.get("model", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": "Você é um editor. Retorne apenas o texto revisado, sem explicações, em Markdown."},
                {"role": "user", "content": f"Instrução: {instruction}\n\nTexto:\n{text}"},
            ],
            max_tokens=2000,
        )
        result = r.choices[0].message.content or ""
        return flask.jsonify({"text": result})
    except Exception as e:
        return flask.jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print(f"Conteúdo: {CONTENT_DIR}")
    print("Acesse: http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)
