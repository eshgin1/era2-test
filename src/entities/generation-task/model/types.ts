import { LucideIcon } from "lucide-react";

export type TaskStatus = 'queued' | 'inProgress' | 'completed' | 'error';

export interface Task {  
  id: string;
  Icon: LucideIcon;
  title: string;
  model: string;
  estimatedTime: number | null;
  cost: number;
  status: TaskStatus;
  progress: number; 
  createdAt: number; 
}