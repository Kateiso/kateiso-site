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
  let existing = [];
  try {
    const prev = JSON.parse(await fsp.readFile(manifestPath, 'utf8'));
    existing = Array.isArray(prev.items) ? prev.items : [];
  } catch {}
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

  let movedAny = false;
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
    movedAny = true;
  }

  if (movedAny) {
    // Merge with existing and de-duplicate by image path
    const merged = [...items, ...existing];
    const seen = new Set();
    const dedup = merged.filter((it) => {
      const key = (it.image || '') + '|' + (it.video || '');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    dedup.sort((a, b) => (a.date < b.date ? 1 : -1));
    await fsp.writeFile(manifestPath, JSON.stringify({ items: dedup }, null, 2));
  } else if (existing.length === 0) {
    // Fallback: rebuild manifest from files already in the gallery directory
    const files = await fsp.readdir(destDir, { withFileTypes: true });
    const byBase = new Map();
    for (const ent of files) {
      if (!ent.isFile()) continue;
      const ext = path.extname(ent.name).toLowerCase();
      if (!IMAGE_EXTS.has(ext) && !VIDEO_EXTS.has(ext)) continue;
      const base = path.basename(ent.name, ext);
      const arr = byBase.get(base) || [];
      arr.push(ent.name);
      byBase.set(base, arr);
    }
    const rebuilt = [];
    for (const [base, names] of byBase.entries()) {
      const datePart = base.slice(0, 10);
      const captionSlug = base.length > 11 ? base.slice(11) : base;
      const caption = captionSlug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
      const imageName = names.find((n) => IMAGE_EXTS.has(path.extname(n).toLowerCase()));
      const videoName = names.find((n) => VIDEO_EXTS.has(path.extname(n).toLowerCase()));
      const image = imageName ? `/assets/media/gallery/${imageName}` : '';
      const video = videoName ? `/assets/media/gallery/${videoName}` : undefined;
      rebuilt.push({ date: datePart, title: caption, image, video });
    }
    rebuilt.sort((a, b) => (a.date < b.date ? 1 : -1));
    await fsp.writeFile(manifestPath, JSON.stringify({ items: rebuilt }, null, 2));
  }

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
