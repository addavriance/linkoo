import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randInt(min: number, max: number): number {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new Error('min и max должны быть конечными числами');
  }

  const from = Math.ceil(min);
  const to = Math.floor(max);

  if (from > to) {
    throw new Error('min не может быть больше max');
  }

  return Math.floor(Math.random() * (to - from + 1)) + from;
}
