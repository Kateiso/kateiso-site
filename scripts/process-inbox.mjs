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
      return { name, path: p, birth: st.birthtime || st.mtime };
    }));
    stats.sort((a, b) => a.birth - b.birth);
    const date = stats[0]?.birth ? new Date(stats[0].birth) : new Date();
    const dateStr = formatDate(date);

    const imageFile = stats.find(s => IMAGE_EXTS.has(path.extname(s.name).toLowerCase()));
    const videoFile = stats.find(s => VIDEO_EXTS.has(path.extname(s.name).toLowerCase()));

    if (!imageFile && !videoFile) continue;

    const title = baseKey.replace(/[-_]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
    const slug = `${dateStr}-${slugify(baseKey)}`;

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
}

main().catch((err) => {
  console.error('[inbox] Failed:', err);
  process.exit(1);
});

