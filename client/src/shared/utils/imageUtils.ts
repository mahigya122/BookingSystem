export const imageSizes = {
  avatar: 96,
  thumbnail: 150,
  preview: 300,
  card: 400,
  medium: 500,
  featured: 600,
  hero: 800,
  full: 1200,
} as const;

export type ImageSizeName = keyof typeof imageSizes;

export function getOptimizedImageUrl(
  url: string | undefined | null,
  width: number | ImageSizeName = 600,
  quality: number = 75
): string {
  if (!url) return "";
  
  const numericWidth = typeof width === "number" ? width : imageSizes[width];
  
  // 1. Unsplash optimization
  if (url.includes("unsplash.com")) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set("w", numericWidth.toString());
      urlObj.searchParams.set("q", quality.toString());
      urlObj.searchParams.set("auto", "format");
      urlObj.searchParams.set("fit", "crop");
      return urlObj.toString();
    } catch {
      return url;
    }
  }
  
  // 2. Picsum optimization
  if (url.includes("picsum.photos")) {
    try {
      const [baseUrl, queryStr] = url.split("?");
      const parts = baseUrl.split("/");
      const lastPart = parts[parts.length - 1];
      const secondLastPart = parts[parts.length - 2];
      
      if (/^\d+$/.test(lastPart) && /^\d+$/.test(secondLastPart)) {
        parts[parts.length - 1] = Math.round(numericWidth * 0.75).toString();
        parts[parts.length - 2] = numericWidth.toString();
        const newBase = parts.join("/");
        return queryStr ? `${newBase}?${queryStr}` : newBase;
      } else if (/^\d+$/.test(lastPart)) {
        parts[parts.length - 1] = numericWidth.toString();
        const newBase = parts.join("/");
        return queryStr ? `${newBase}?${queryStr}` : newBase;
      }
      return url;
    } catch {
      return url;
    }
  }
  
  return url;
}
