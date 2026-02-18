export interface GalleryImageSet {
  sm: string;
  md: string;
  lg: string;
  original: string;
}

export interface GalleryVideoSet {
  src: string;
  poster: string;
}

export interface GalleryItem {
  id: string;
  date: string;
  title: string;
  image: GalleryImageSet;
  video?: GalleryVideoSet;
}

type LegacyImage = string | Partial<GalleryImageSet> | undefined;
type LegacyVideo = string | Partial<GalleryVideoSet> | undefined;

interface RawGalleryItem {
  id?: string;
  date?: string;
  title?: string;
  image?: LegacyImage;
  video?: LegacyVideo;
}

function resolveImage(image: LegacyImage): GalleryImageSet | null {
  if (typeof image === 'string' && image) {
    return { sm: image, md: image, lg: image, original: image };
  }

  if (!image || typeof image !== 'object') {
    return null;
  }

  const fallback = image.original || image.lg || image.md || image.sm;
  if (!fallback) {
    return null;
  }

  return {
    sm: image.sm || fallback,
    md: image.md || fallback,
    lg: image.lg || fallback,
    original: image.original || fallback,
  };
}

function resolveVideo(video: LegacyVideo, image: GalleryImageSet): GalleryVideoSet | undefined {
  if (!video) {
    return undefined;
  }

  if (typeof video === 'string') {
    return { src: video, poster: image.lg };
  }

  const src = video.src;
  if (!src) {
    return undefined;
  }

  return {
    src,
    poster: video.poster || image.lg,
  };
}

export function normalizeGalleryItems(list: unknown[]): GalleryItem[] {
  return (Array.isArray(list) ? list : [])
    .map((raw, index) => {
      const item = (raw || {}) as RawGalleryItem;
      const image = resolveImage(item.image);
      if (!image) {
        return null;
      }

      if ((image.original || '').toLowerCase().includes('favicon')) {
        return null;
      }

      const title = (item.title || '').trim() || `Moment ${index + 1}`;
      const date = (item.date || '').trim();
      const id = item.id || `${date || 'unknown'}-${index}`;

      return {
        id,
        date,
        title,
        image,
        video: resolveVideo(item.video, image),
      } as GalleryItem;
    })
    .filter((item): item is GalleryItem => Boolean(item));
}
