import { Gamepad2, Github, Send, MessageSquare } from 'lucide-react';
import { SocialLink } from './types';

export const USER_INFO = {
  nickname: "BfG_Animeshnik",
  tagline: "Безумный Ученый / Mad Scientist",
  description: "Исследователь временных линий. Любитель аниме, игр и кодинга. Добро пожаловать в Лабораторию Гаджетов Будущего.",
  divergenceNumber: "1.048596",
  avatarUrl: "https://picsum.photos/seed/bfg/400/400" // Placeholder, styled to look cool later
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'steam',
    title: 'Steam Profile',
    url: 'https://steamcommunity.com/id/bfg_anime',
    icon: Gamepad2,
    color: 'hover:text-[#1b2838] hover:bg-[#66c0f4]'
  },
  {
    id: 'telegram',
    title: 'Telegram',
    url: '#', // Placeholder
    icon: Send,
    color: 'hover:text-white hover:bg-[#229ED9]'
  },
  {
    id: 'discord',
    title: 'Discord',
    url: '#', // Placeholder
    icon: MessageSquare,
    color: 'hover:text-white hover:bg-[#5865F2]'
  },
  {
    id: 'github',
    title: 'GitHub',
    url: '#', // Placeholder
    icon: Github,
    color: 'hover:text-black hover:bg-white'
  }
];
