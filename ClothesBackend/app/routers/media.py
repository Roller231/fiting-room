from fastapi import APIRouter, UploadFile, File, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import os
import uuid
import shutil
from pathlib import Path
from typing import List

router = APIRouter()
BASE_DIR = Path("media")
BASE_DIR.mkdir(exist_ok=True)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB

def ensure_dir(target_dir: str) -> Path:
    d = BASE_DIR / target_dir
    d.mkdir(parents=True, exist_ok=True)
    return d

def safe_filename(filename: str) -> str:
    ext = Path(filename).suffix.lower()
    name = uuid.uuid4().hex
    return f"{name}{ext}"

@router.post("/upload")
async def upload_file(request: Request, file: UploadFile = File(...), target_dir: str = "default"):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Unsupported file type")
    if file.size and file.size > MAX_SIZE:
        raise HTTPException(400, "File too large")

    dir_path = ensure_dir(target_dir)
    filename = safe_filename(file.filename)
    dest = dir_path / filename

    with dest.open("wb") as f:
        shutil.copyfileobj(file.file, f)

    rel_path = dest.relative_to(BASE_DIR).as_posix()
    return JSONResponse({"path": rel_path})

@router.get("/files", response_model=list)
async def list_files(target_dir: str = "default"):
    dir_path = ensure_dir(target_dir)
    files = []
    for p in dir_path.iterdir():
        if p.is_file():
            files.append({
                "name": p.name,
                "path": p.relative_to(BASE_DIR).as_posix(),
                "size": p.stat().st_size,
                "url": f"/static/{p.relative_to(BASE_DIR).as_posix()}"
            })
    return JSONResponse(files)

@router.get("/dirs", response_model=list)
async def list_dirs():
    dirs = [d.name for d in BASE_DIR.iterdir() if d.is_dir()]
    return JSONResponse(dirs)

@router.delete("/files/{target_dir}/{filename}")
async def delete_file(target_dir: str, filename: str):
    file_path = BASE_DIR / target_dir / filename
    if not file_path.is_file():
        raise HTTPException(404, "File not found")
    file_path.unlink()
    return {"ok": True}

@router.get("/library", response_class=HTMLResponse)
async def library_page():
    html = """
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Библиотека медиафайлов</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,-apple-system,sans-serif;background:#f5f7fa}
header{background:#fff;border-bottom:1px solid #e0e6ed;padding:1rem 2rem}
header h1{font-size:1.25rem;color:#1e293b}
main{max-width:1400px;margin:2rem auto;display:grid;grid-template-columns:240px 1fr;gap:2rem}
aside{background:#fff;border-radius:12px;padding:1.5rem}
aside h2{font-size:0.875rem;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;margin-bottom:1rem}
.folder-list{list-style:none}
.folder-list li{padding:0.5rem 0.75rem;border-radius:8px;cursor:pointer}
.folder-list li:hover{background:#f1f5f9}
.folder-list li.active{background:#dbeafe;color:#2563eb;font-weight:600}
.upload-area{background:#fff;border:2px dashed #cbd5e1;border-radius:12px;padding:3rem;text-align:center;transition:border-color 0.2s}
.upload-area.dragover{border-color:#3b82f6;background:#f0f9ff}
.upload-area p{margin-top:0.5rem;color:#64748b}
.file-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem;margin-top:2rem}
.file-card{background:#fff;border-radius:12px;overflow:hidden;position:relative;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s}
.file-card:hover{transform:scale(1.02);box-shadow:0 4px 12px rgba(0,0,0,0.08)}
.file-card img{width:100%;height:120px;object-fit:cover}
.file-card .info{padding:0.75rem}
.file-card .name{font-size:0.875rem;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.file-card .meta{font-size:0.75rem;color:#94a3b8;margin-top:0.25rem}
.file-card .copy-btn{position:absolute;top:0.5rem;right:0.5rem;background:rgba(0,0,0,0.6);color:#fff;border:none;border-radius:6px;padding:0.25rem 0.5rem;font-size:0.75rem;cursor:pointer;opacity:0;transition:opacity 0.2s}
.file-card:hover .copy-btn{opacity:1}
.file-card .delete-btn{position:absolute;top:0.5rem;left:0.5rem;background:#ef4444;color:#fff;border:none;border-radius:6px;padding:0.25rem 0.5rem;font-size:0.75rem;cursor:pointer;opacity:0;transition:opacity 0.2s}
.file-card:hover .delete-btn{opacity:1}
</style>
</head>
<body>
<header><h1>📁 Библиотека медиафайлов</h1></header>
<main>
<aside>
<h2>Папки</h2>
<ul class="folder-list" id="folderList"></ul>
</aside>
<section>
<div class="upload-area" id="uploadArea">
<div style="font-size:3rem">📤</div>
<p>Перетащите файлы сюда или кликните для выбора</p>
<input type="file" id="fileInput" multiple accept="image/*" hidden>
</div>
<div class="file-grid" id="fileGrid"></div>
</section>
</main>

<script>
const API = '';
let currentDir = 'default';

async function fetchDirs() {
  const r = await fetch(`${API}/dirs`);
  const dirs = await r.json();
  const ul = document.getElementById('folderList');
  ul.innerHTML = dirs.map(d => `<li data-dir="${d}" class="${d===currentDir?'active':''}">${d}</li>`).join('');
  ul.querySelectorAll('li').forEach(li => li.onclick = () => loadDir(li.dataset.dir));
}

async function loadDir(dir = 'default') {
  currentDir = dir;
  document.querySelectorAll('.folder-list li').forEach(li => li.classList.toggle('active', li.dataset.dir===dir));
  const r = await fetch(`${API}/files?target_dir=${dir}`);
  const files = await r.json();
  const grid = document.getElementById('fileGrid');
  grid.innerHTML = files.map(f => `
    <div class="file-card" data-path="${f.path}">
      <button class="delete-btn" onclick="deleteFile('${f.path}')">🗑</button>
      <button class="copy-btn" onclick="copyPath('${f.path}')">📋</button>
      <img src="${f.url}" loading="lazy">
      <div class="info">
        <div class="name">${f.name}</div>
        <div class="meta">${(f.size/1024).toFixed(1)}KB</div>
      </div>
    </div>
  `).join('');
}

async function uploadFiles(files) {
  const fd = new FormData();
  for (const file of files) fd.append('file', file);
  fd.append('target_dir', currentDir);
  const r = await fetch(`${API}/upload`, {method:'POST', body:fd});
  if (!r.ok) alert('Ошибка загрузки');
  await loadDir(currentDir);
}

async function deleteFile(path) {
  if (!confirm('Удалить файл?')) return;
  const [dir, ...name] = path.split('/');
  await fetch(`${API}/files/${dir}/${name.join('/')}`, {method:'DELETE'});
  await loadDir(currentDir);
}

function copyPath(path) {
  navigator.clipboard.writeText(path);
  const btn = event.target;
  const txt = btn.textContent;
  btn.textContent = '✅';
  setTimeout(() => btn.textContent = txt, 1000);
}

// drag-and-drop
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');

uploadArea.onclick = () => fileInput.click();
fileInput.onchange = () => uploadFiles(fileInput.files);

uploadArea.ondragover = e => { e.preventDefault(); uploadArea.classList.add('dragover'); };
uploadArea.ondragleave = () => uploadArea.classList.remove('dragover');
uploadArea.ondrop = e => { e.preventDefault(); uploadArea.classList.remove('dragover'); uploadFiles(e.dataTransfer.files); };

fetchDirs(); loadDir();
</script>
</body>
</html>
    """
    return HTMLResponse(content=html)
