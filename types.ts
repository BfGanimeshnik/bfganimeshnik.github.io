import { LucideIcon } from 'lucide-react';

export interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon: LucideIcon;
  color?: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedY: number;
}
