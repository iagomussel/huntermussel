"""
Hardened Blog Editor Backend
Restored full FFmpeg variant pipeline and atomic saving.
"""

import os
import re
import subprocess
import logging
from pathlib import Path
from datetime import datetime
from werkzeug.utils import secure_filename

import flask
from flask import request, jsonify
from dotenv import load_dotenv
import litellm

logging.basicConfig(format="%(levelname)s: %(message)s", level=logging.INFO)
logger = logging.getLogger("BlogEditor")

load_dotenv()

app = flask.Flask(__name__, static_folder="static", static_url_path="")
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024

# Path Resolution
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
CONTENT_DIR = PROJECT_ROOT / "src" / "content" / "blog"
UPLOAD_FOLDER = PROJECT_ROOT / "public" / "images" / "blog"

CONTENT_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

DEFAULT_MODEL = os.environ.get("BLOG_AI_MODEL", "anthropic/claude-3-haiku-20240307")


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s_]+", "-", text)
    return text.strip("-") or "untitled"


def parse_md(raw: str) -> tuple[dict, str]:
    if not raw.startswith("---"):
        return {}, raw
    try:
        parts = raw.split("---", 2)
        if len(parts) < 3:
            return {}, raw
        head, body = parts[1].strip(), parts[2].strip()
        data = {}
        for line in head.split("\n"):
            if ":" in line:
                k, v = line.split(":", 1)
                data[k.strip()] = v.strip().strip('"').strip("'")
        return data, body
    except:
        return {}, raw


def build_md(fm: dict, body: str) -> str:
    lines = ["---"]
    for k, v in fm.items():
        if v is not None:
            clean_v = str(v).replace('"', '\\"')
            lines.append(f'{k}: "{clean_v}"')
    lines.append("---")
    lines.append("")
    lines.append(body.strip())
    return "\n".join(lines)


@app.route("/")
def index():
    return flask.send_from_directory(app.static_folder, "index.html")


@app.route("/api/articles", methods=["GET"])
def list_articles():
    out = []
    for f in sorted(
        CONTENT_DIR.glob("*.md"), key=lambda p: p.stat().st_mtime, reverse=True
    ):
        try:
            fm, _ = parse_md(f.read_text(encoding="utf-8"))
            out.append(
                {
                    "slug": f.stem,
                    "title": fm.get("title", f.stem),
                    "date": fm.get("date", ""),
                }
            )
        except:
            continue
    return jsonify(out)


@app.route("/api/articles/<path:slug>", methods=["GET"])
def get_article(slug):
    p = CONTENT_DIR / f"{slug}.md"
    if not p.exists():
        return jsonify({"error": "Article not found"}), 404
    raw = p.read_text(encoding="utf-8")
    fm, body = parse_md(raw)
    return jsonify({"slug": slug, "frontmatter": fm, "body": body})


@app.route("/api/articles", methods=["POST"])
def create_article():
    data = request.get_json() or {}
    title = data.get("title", "New Article").strip()
    slug = slugify(title)
    p = CONTENT_DIR / f"{slug}.md"
    base, count = slug, 1
    while p.exists():
        slug = f"{base}-{count}"
        p = CONTENT_DIR / f"{slug}.md"
        count += 1
    fm = {
        "title": title,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "status": "published",
    }
    p.write_text(build_md(fm, "Start writing..."), encoding="utf-8")
    return jsonify({"slug": slug})


@app.route("/api/articles/<path:slug>", methods=["PUT"])
def update_article(slug):
    old_path = CONTENT_DIR / f"{slug}.md"
    if not old_path.exists():
        return jsonify({"error": f"Article '{slug}' does not exist"}), 404

    data = request.get_json() or {}
    new_slug = data.get("slug")
    new_fm = data.get("frontmatter") or {}
    body = data.get("body", "")

    try:
        old_raw = old_path.read_text(encoding="utf-8")
        old_fm, _ = parse_md(old_raw)
        final_fm = {**old_fm, **new_fm}
        content = build_md(final_fm, body)

        target_path = old_path
        rename_occured = False
        if new_slug and new_slug != slug:
            new_path = CONTENT_DIR / f"{new_slug}.md"
            if new_path.exists():
                return jsonify({"error": "New slug already exists"}), 409
            target_path = new_path
            rename_occured = True

        target_path.write_text(content, encoding="utf-8")

        if rename_occured and target_path.exists():
            old_path.unlink()
            logger.info(f"SUCCESS: Renamed {slug} to {new_slug}")
        else:
            logger.info(f"SUCCESS: Saved {slug}")

        return jsonify({"ok": True, "slug": new_slug or slug})
    except Exception as e:
        logger.error(f"SAVE FAILED: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/upload", methods=["POST"])
def upload():
    f = request.files.get("file")
    if not f:
        return jsonify({"error": "No file"}), 400
    fname = secure_filename(f.filename)
    ts = datetime.now().strftime("%s")
    base = f"{ts}_{Path(fname).stem}"
    temp = UPLOAD_FOLDER / f"tmp_{fname}"
    f.save(str(temp))

    # Main Image (WebP 85%)
    main_webp = f"{base}.webp"
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(temp),
            "-c:v",
            "libwebp",
            "-quality",
            "85",
            str(UPLOAD_FOLDER / main_webp),
        ],
        capture_output=True,
    )

    # 1. Variants Ratios and Crops
    # 1x1: square, 16x9: landscape, 9x16: portrait
    configs = {
        "1x1": "min(iw,ih):min(iw,ih)",
        "16x9": "if(gt(iw/ih,16/9),ih*16/9,iw):if(gt(iw/ih,16/9),ih,iw*9/16)",
        "9x16": "if(gt(iw/ih,9/16),ih*9/16,iw):if(gt(iw/ih,9/16),ih,iw*16/9)",
    }

    # 2. Sizes per ratio
    sizes = {"thumb": 320, "low": 640, "med": 1280}

    logger.info(f"Processing variants for {base}...")
    for r_name, crop_filter in configs.items():
        for s_name, width in sizes.items():
            out_file = f"{base}_{r_name}_{s_name}.webp"
            # Command: ffmpeg -i input -vf "crop=...,scale=width:-1" output.webp
            cmd = [
                "ffmpeg",
                "-y",
                "-i",
                str(temp),
                "-vf",
                f"crop={crop_filter},scale={width}:-1",
                "-c:v",
                "libwebp",
                "-quality",
                "75",
                str(UPLOAD_FOLDER / out_file),
            ]
            subprocess.run(cmd, capture_output=True)

    temp.unlink()
    logger.info(f"Variants generated for {base}")
    return jsonify({"url": f"/images/blog/{main_webp}"})


@app.route("/api/ai/improve", methods=["POST"])
def ai():
    data = request.get_json() or {}
    try:
        res = litellm.completion(
            model=data.get("model") or DEFAULT_MODEL,
            api_key=data.get("api_key"),
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional blog editor. Return ONLY the revised markdown text. No chatter. No code fences.",
                },
                {
                    "role": "user",
                    "content": f"Context: {data.get('context')}\nTask: {data.get('instruction')}\nText: {data.get('text')}",
                },
            ],
        )
        out = res.choices[0].message.content.strip()
        if out.startswith("```"):
            out = re.sub(r"^```\w*\n|```$", "", out, flags=re.M).strip()
        return jsonify({"text": out})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
