"use client";

import Image, { ImageProps } from "next/image";

/**
 * OptimizedImage component that handles both local and remote images
 * - Local images (/product-images/*) are served unoptimized from public folder
 * - Remote images (Cloudinary, Unsplash) use Next.js optimization
 */
export function OptimizedImage(props: ImageProps) {
  const { src, ...rest } = props;

  // Check if image is a local path (starts with /)
  const isLocalImage = typeof src === 'string' && src.startsWith('/');

  return (
    <Image
      src={src}
      {...rest}
      unoptimized={isLocalImage}
    />
  );
}
