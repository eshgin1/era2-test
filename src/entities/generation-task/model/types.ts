export type GenType = 'image' | 'video' | 'audio' | 'text';
export type TaskStatus = 'queued' | 'inProgress' | 'completed' | 'error' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  model: string;
  type: GenType;
  estimatedTime: number | null;
  cost: number;
  status: TaskStatus;
  progress: number;
  createdAt: number;
  errorMessage?: string;
}