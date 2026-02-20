import { VEHICLE_DATA, PLACEHOLDER_IMAGE } from '@/lib/constants';

export const VEHICLE_GROUPS = VEHICLE_DATA.reduce<Record<string, typeof VEHICLE_DATA[number][]>>(
  (acc, v) => { if (!acc[v.brand]) acc[v.brand] = []; acc[v.brand].push(v); return acc; },
  {}
);

export function formatPrice(n: number) {
  return `KSh ${n.toLocaleString()}`;
}

export function safeImage(images: string[] | null | undefined): string {
  if (Array.isArray(images) && images.length > 0 && images[0]) return images[0];
  return PLACEHOLDER_IMAGE;
}
