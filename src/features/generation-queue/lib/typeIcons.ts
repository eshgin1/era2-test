import { Circle, Play, Music, MessageSquareMore, LucideIcon } from 'lucide-react';
import { GenType } from '@/entities/generation-task/model/types';

export const typeIcons: Record<GenType, LucideIcon> = {
  image: Circle,
  video: Play,
  audio: Music,
  text: MessageSquareMore,
};