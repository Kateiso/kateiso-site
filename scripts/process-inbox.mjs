import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const inboxDir = path.join(root, 'inbox');
const destDir = path.join(root, 'public', 'assets', 'media', 'gallery');
const dataDir = path.join(root, 'public', 'assets', 'data');
const manifestPath = path.join(dataDir, 'gallery.json');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic']);
const VIDEO_EXTS = new Set(['.mov', '.mp4']);

let exifr = null;
let sharp = null;
let ffmpegChecked = false;
let ffmpegAvailable = false;

try {
  exifr = await import('exifr');
} catch {}

try {
  sharp = (await import('sharp')).default;
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

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toPublicPath(absPath) {
  const rel = path.relative(path.join(root, 'public'), absPath).replace(/\\/g, '/');
  return `/${rel}`;
}

function toAbsolutePublicPath(publicPath) {
  return path.join(root, 'public', publicPath.replace(/^\//, ''));
}

function exists(absPath) {
  return fs.existsSync(absPath);
}

function parseImageSet(image) {
  if (typeof image === 'string' && image) {
    return { sm: image, md: image, lg: image, original: image };
  }
  if (!image || typeof image !== 'object') return null;
  const fallback = image.original || image.lg || image.md || image.sm;
  if (!fallback) return null;
  return {
    sm: image.sm || fallback,
    md: image.md || fallback,
    lg: image.lg || fallback,
    original: image.original || fallback,
  };
}

function parseVideoSet(video, imageSet) {
  if (!video) return undefined;
  if (typeof video === 'string') {
    return { src: video, poster: imageSet?.lg || imageSet?.original || '' };
  }
  if (!video.src) return undefined;
  return {
    src: video.src,
    poster: video.poster || imageSet?.lg || imageSet?.original || '',
  };
}

function normalizeManifestItems(list) {
  return (Array.isArray(list) ? list : [])
    .map((raw, index) => {
      const image = parseImageSet(raw.image);
      if (!image || (image.original || '').toLowerCase().includes('favicon')) return null;
      const video = parseVideoSet(raw.video, image);
      return {
        id: raw.id || `${raw.date || 'unknown'}-${index}`,
        date: raw.date || '',
        title: (raw.title || '').trim() || `Moment ${index + 1}`,
        image,
        video,
      };
    })
    .filter(Boolean);
}

function dedupeItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.image.original}|${item.video?.src || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isFfmpegAvailable() {
  if (ffmpegChecked) return ffmpegAvailable;
  ffmpegChecked = true;
  const result = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  ffmpegAvailable = result.status === 0;
  return ffmpegAvailable;
}

async function generateImageVariants(imagePublicPath) {
  const imageAbsPath = toAbsolutePublicPath(imagePublicPath);
  if (!sharp || !exists(imageAbsPath)) {
    return { sm: imagePublicPath, md: imagePublicPath, lg: imagePublicPath, original: imagePublicPath };
  }

  const ext = path.extname(imageAbsPath).toLowerCase();
  if (ext === '.gif') {
    return { sm: imagePublicPath, md: imagePublicPath, lg: imagePublicPath, original: imagePublicPath };
  }

  const baseName = path.basename(imageAbsPath, ext);
  const dir = path.dirname(imageAbsPath);
  const sizes = [
    ['sm', 480],
    ['md', 960],
    ['lg', 1600],
  ];

  const variants = {};
  for (const [name, width] of sizes) {
    const outAbs = path.join(dir, `${baseName}-${name}.webp`);
    if (!exists(outAbs)) {
      try {
        await sharp(imageAbsPath)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(outAbs);
      } catch {
        variants[name] = imagePublicPath;
        continue;
      }
    }
    variants[name] = toPublicPath(outAbs);
  }

  return {
    sm: variants.sm || imagePublicPath,
    md: variants.md || imagePublicPath,
    lg: variants.lg || imagePublicPath,
    original: imagePublicPath,
  };
}

async function generateVideoPoster(videoPublicPath, fallbackPoster = '') {
  const videoAbsPath = toAbsolutePublicPath(videoPublicPath);
  if (!exists(videoAbsPath) || !isFfmpegAvailable()) {
    return fallbackPoster;
  }

  const ext = path.extname(videoAbsPath);
  const base = path.basename(videoAbsPath, ext);
  const posterAbs = path.join(path.dirname(videoAbsPath), `${base}-poster.jpg`);

  if (!exists(posterAbs)) {
    const result = spawnSync(
      'ffmpeg',
      ['-y', '-i', videoAbsPath, '-vf', 'thumbnail,scale=960:-1', '-frames:v', '1', posterAbs],
      { stdio: 'ignore' },
    );
    if (result.status !== 0 || !exists(posterAbs)) {
      return fallbackPoster;
    }
  }

  return toPublicPath(posterAbs);
}

function cleanupCaption(base) {
  return base.replace(/[-_]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

async function moveUnique(srcPath, destBase, ext) {
  let candidate = path.join(destDir, `${destBase}${ext.toLowerCase()}`);
  let i = 1;
  while (exists(candidate)) {
    candidate = path.join(destDir, `${destBase}-${i}${ext.toLowerCase()}`);
    i += 1;
  }
  await fsp.rename(srcPath, candidate);
  return candidate;
}

async function buildItemFromMovedFiles({ dateStr, title, slug, imageAbs, videoAbs }) {
  let imageSet = null;
  let imagePublic = '';
  if (imageAbs) {
    imagePublic = toPublicPath(imageAbs);
    imageSet = await generateImageVariants(imagePublic);
  }

  let videoSet;
  if (videoAbs) {
    const videoPublic = toPublicPath(videoAbs);
    const poster = await generateVideoPoster(videoPublic, imageSet?.lg || imagePublic);
    if (!imageSet && poster) {
      imageSet = { sm: poster, md: poster, lg: poster, original: poster };
    }
    videoSet = { src: videoPublic, poster: poster || imageSet?.lg || '' };
  }

  if (!imageSet) return null;

  return {
    id: slug,
    date: dateStr,
    title,
    image: imageSet,
    video: videoSet,
  };
}

async function rebuildManifestFromGallery() {
  const entries = await fsp.readdir(destDir, { withFileTypes: true });
  const byBase = new Map();

  for (const ent of entries) {
    if (!ent.isFile()) continue;
    const ext = path.extname(ent.name).toLowerCase();
    if (!IMAGE_EXTS.has(ext) && !VIDEO_EXTS.has(ext)) continue;

    const base = path.basename(ent.name, ext);
    if (/(?:-sm|-md|-lg|-poster)$/i.test(base)) continue;
    if (base.toLowerCase().includes('favicon')) continue;

    const group = byBase.get(base) || [];
    group.push(ent.name);
    byBase.set(base, group);
  }

  const rebuilt = [];

  for (const [base, names] of byBase.entries()) {
    const imageName = names.find((name) => IMAGE_EXTS.has(path.extname(name).toLowerCase()));
    const videoName = names.find((name) => VIDEO_EXTS.has(path.extname(name).toLowerCase()));

    let imageSet = null;
    if (imageName) {
      imageSet = await generateImageVariants(`/assets/media/gallery/${imageName}`);
    }

    let videoSet;
    if (videoName) {
      const videoPath = `/assets/media/gallery/${videoName}`;
      const poster = await generateVideoPoster(videoPath, imageSet?.lg || '');
      if (!imageSet && poster) {
        imageSet = { sm: poster, md: poster, lg: poster, original: poster };
      }
      videoSet = { src: videoPath, poster: poster || imageSet?.lg || '' };
    }

    if (!imageSet) continue;

    const datePart = /^\d{4}-\d{2}-\d{2}/.test(base) ? base.slice(0, 10) : '';
    const captionSlug = base.length > 11 ? base.slice(11) : base;

    rebuilt.push({
      id: base,
      date: datePart,
      title: cleanupCaption(captionSlug),
      image: imageSet,
      video: videoSet,
    });
  }

  rebuilt.sort((a, b) => (a.date < b.date ? 1 : -1));
  return dedupeItems(rebuilt);
}

async function hydrateExistingItems(items) {
  const hydrated = [];
  for (const item of items) {
    const original = item.image?.original || item.image?.lg || item.image?.md || item.image?.sm;
    if (!original) continue;
    const image = await generateImageVariants(original);
    const video = item.video?.src
      ? {
          src: item.video.src,
          poster: await generateVideoPoster(item.video.src, item.video.poster || image.lg),
        }
      : undefined;
    hydrated.push({
      ...item,
      image,
      video,
    });
  }
  return hydrated;
}

async function main() {
  await ensureDir(destDir);
  await ensureDir(dataDir);

  let existing = [];
  try {
    const prev = JSON.parse(await fsp.readFile(manifestPath, 'utf8'));
    existing = await hydrateExistingItems(normalizeManifestItems(prev.items || []));
  } catch {}

  const items = [];

  if (!fs.existsSync(inboxDir)) {
    await fsp.writeFile(manifestPath, JSON.stringify({ items: existing }, null, 2));
    return;
  }

  const entries = await fsp.readdir(inboxDir, { withFileTypes: true });
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
    if (baseKey.includes('favicon')) continue;

    const stats = await Promise.all(files.map(async (name) => {
      const absPath = path.join(inboxDir, name);
      const stat = await fsp.stat(absPath);
      let when = stat.birthtime || stat.mtime;
      const ext = path.extname(name).toLowerCase();
      if (exifr && IMAGE_EXTS.has(ext)) {
        try {
          const meta = await exifr.parse(absPath, { tiff: true, ifd0: true, exif: true });
          const exifDate = meta?.DateTimeOriginal || meta?.CreateDate || meta?.ModifyDate;
          if (exifDate) when = exifDate;
        } catch {}
      }
      return { name, absPath, when };
    }));

    stats.sort((a, b) => a.when - b.when);
    const date = stats[0]?.when ? new Date(stats[0].when) : new Date();
    const dateStr = formatDate(date);

    const imageFile = stats.find((item) => IMAGE_EXTS.has(path.extname(item.name).toLowerCase()));
    const videoFile = stats.find((item) => VIDEO_EXTS.has(path.extname(item.name).toLowerCase()));

    if (!imageFile && !videoFile) continue;

    const originalBase = files[0] ? path.basename(files[0], path.extname(files[0])) : baseKey;
    const title = originalBase.trim();
    const slug = `${dateStr}-${slugify(originalBase)}`;

    const imageAbs = imageFile ? await moveUnique(imageFile.absPath, slug, path.extname(imageFile.name)) : null;
    const videoAbs = videoFile ? await moveUnique(videoFile.absPath, slug, path.extname(videoFile.name)) : null;

    const item = await buildItemFromMovedFiles({
      dateStr,
      title,
      slug,
      imageAbs,
      videoAbs,
    });

    if (item) {
      items.push(item);
      movedAny = true;
    }
  }

  if (movedAny) {
    const merged = dedupeItems([...items, ...existing]);
    merged.sort((a, b) => (a.date < b.date ? 1 : -1));
    await fsp.writeFile(manifestPath, JSON.stringify({ items: merged }, null, 2));
  } else if (existing.length === 0) {
    const rebuilt = await rebuildManifestFromGallery();
    await fsp.writeFile(manifestPath, JSON.stringify({ items: rebuilt }, null, 2));
  } else {
    await fsp.writeFile(manifestPath, JSON.stringify({ items: existing }, null, 2));
  }

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
  const match = src.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { valid: false };

  const body = match[1];
  const fields = Object.create(null);
  for (const line of body.split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2];
  }

  const required = ['title', 'description', 'type', 'date', 'summary'];
  const ok = required.every((key) => key in fields);
  return { valid: ok };
}
