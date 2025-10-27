import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const inboxDir = path.join(root, 'inbox');
const destDir = path.join(root, 'public', 'assets', 'media', 'gallery');
const dataDir = path.join(root, 'public', 'assets', 'data');
const manifestPath = path.join(dataDir, 'gallery.json');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic']);
const VIDEO_EXTS = new Set(['.mov', '.mp4']);
let exifr = null;
try {
  // Optional dependency. If not installed, fall back to birthtime.
  exifr = await import('exifr');
} catch {}

function slugify(str) {
  return String(str)
    .normalize('NFKD')
    .replace(/['"`]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function main() {
  await ensureDir(destDir);
  await ensureDir(dataDir);
  const items = [];

  if (!fs.existsSync(inboxDir)) {
    await fsp.writeFile(manifestPath, JSON.stringify({ items }, null, 2));
    return;
  }

  const entries = await fsp.readdir(inboxDir, { withFileTypes: true });
  // group by base name (case-insensitive) to pair Live Photos (image + video)
  const groups = new Map();
  for (const ent of entries) {
    if (!ent.isFile()) continue;
    const ext = path.extname(ent.name).toLowerCase();
    if (!IMAGE_EXTS.has(ext) && !VIDEO_EXTS.has(ext)) continue;
    const base = path.basename(ent.name, path.extname(ent.name));
    const key = base.toLowerCase();
    const arr = groups.get(key) || [];
    arr.push(ent.name);
    groups.set(key, arr);
  }

  for (const [baseKey, files] of groups.entries()) {
    // Determine date from earliest birthtime among grouped files
    const stats = await Promise.all(files.map(async (name) => {
      const p = path.join(inboxDir, name);
      const st = await fsp.stat(p);
      let when = st.birthtime || st.mtime;
      // Prefer EXIF capture time for images
      const ext = path.extname(name).toLowerCase();
      if (exifr && IMAGE_EXTS.has(ext)) {
        try {
          const meta = await exifr.parse(p, { tiff: true, ifd0: true, exif: true });
          const exifDate = meta?.DateTimeOriginal || meta?.CreateDate || meta?.ModifyDate;
          if (exifDate) when = exifDate;
        } catch {}
      }
      return { name, path: p, when };
    }));
    stats.sort((a, b) => a.when - b.when);
    const date = stats[0]?.when ? new Date(stats[0].when) : new Date();
    const dateStr = formatDate(date);

    const imageFile = stats.find(s => IMAGE_EXTS.has(path.extname(s.name).toLowerCase()));
    const videoFile = stats.find(s => VIDEO_EXTS.has(path.extname(s.name).toLowerCase()));

    if (!imageFile && !videoFile) continue;

    const originalBase = files[0] ? path.basename(files[0], path.extname(files[0])) : baseKey;
    const title = originalBase.trim();
    const slug = `${dateStr}-${slugify(originalBase)}`;

    async function moveUnique(srcPath, destBase, ext) {
      let candidate = path.join(destDir, `${destBase}${ext.toLowerCase()}`);
      let i = 1;
      while (fs.existsSync(candidate)) {
        candidate = path.join(destDir, `${destBase}-${i}${ext.toLowerCase()}`);
        i++;
      }
      await fsp.rename(srcPath, candidate);
      return candidate;
    }

    let destImage = '';
    let destVideo = '';
    if (imageFile) {
      const imgExt = path.extname(imageFile.name);
      const moved = await moveUnique(imageFile.path, slug, imgExt);
      destImage = moved.replace(root, '').replace(/\\/g, '/');
    }
    if (videoFile) {
      const vidExt = path.extname(videoFile.name);
      const moved = await moveUnique(videoFile.path, slug, vidExt);
      destVideo = moved.replace(root, '').replace(/\\/g, '/');
    }

    items.push({
      date: dateStr,
      title,
      image: destImage.replace(/^\/public/, ''),
      video: destVideo ? destVideo.replace(/^\/public/, '') : undefined,
    });
  }

  // Sort newest first
  items.sort((a, b) => (a.date < b.date ? 1 : -1));
  await fsp.writeFile(manifestPath, JSON.stringify({ items }, null, 2));

  // Also process Markdown posts dropped into inbox
  await processInboxPosts();
}

main().catch((err) => {
  console.error('[inbox] Failed:', err);
  process.exit(1);
});

async function processInboxPosts() {
  const candidates = [];
  for (const dir of [inboxDir, path.join(inboxDir, 'posts')]) {
    if (!fs.existsSync(dir)) continue;
    const ents = await fsp.readdir(dir, { withFileTypes: true });
    for (const ent of ents) {
      if (ent.isFile() && ent.name.toLowerCase().endsWith('.md')) {
        candidates.push(path.join(dir, ent.name));
      }
    }
  }
  if (!candidates.length) return;
  const outDir = path.join(root, 'src', 'content', 'posts');
  await ensureDir(outDir);

  for (const file of candidates) {
    const raw = await fsp.readFile(file, 'utf8');
    const fm = parseFrontmatter(raw);
    if (!fm.valid) {
      console.warn(`[inbox] Skipped (missing required frontmatter): ${path.basename(file)}`);
      continue;
    }
    const base = path.basename(file, path.extname(file));
    const slug = slugify(base);
    const dest = path.join(outDir, `${slug}.md`);
    await fsp.rename(file, dest);
    console.log(`[inbox] Moved post → ${path.relative(root, dest)}`);
  }
}

function parseFrontmatter(src) {
  // Minimal YAML frontmatter parser; expects --- \n ... \n --- at top
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return { valid: false };
  const body = m[1];
  const fields = Object.create(null);
  for (const line of body.split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2];
  }
  const required = ['title','description','type','date','summary'];
  const ok = required.every((k) => k in fields);
  return { valid: ok };
}
