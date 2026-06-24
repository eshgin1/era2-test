import { Task, TaskStatus } from '@/entities/generation-task/model/types';
import { enforceQueueLimit } from './queueEngine';

export type SortOrder = 'newest' | 'oldest';

export interface QueueState {
  tasks: Task[];
  activeStatus: TaskStatus | null;
  sortOrder: SortOrder;
}

export type QueueAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_FILTER'; payload: TaskStatus | null }
  | { type: 'SET_SORT'; payload: SortOrder }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'CLEAR_COMPLETED' }; 

export const queueReducer = (state: QueueState, action: QueueAction): QueueState => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_FILTER':
      return { ...state, activeStatus: action.payload };
    case 'SET_SORT':
      return { ...state, sortOrder: action.payload };
    case 'CLEAR_COMPLETED': {
      // Удаляем все задачи со статусом 'completed'
      const filtered = state.tasks.filter(task => task.status !== 'completed');
      return { ...state, tasks: filtered };
    }
    // case 'UPDATE_TASK': {
    //   // Обновляем задачу, затем применяем лимит
    //   const index = state.tasks.findIndex(t => t.id === action.payload.id);
    //   if (index === -1) return state;
    //   const newTasks = [...state.tasks];
    //   newTasks[index] = action.payload;
    //   // Применяем лимит
    //   const limitedTasks = enforceQueueLimit(newTasks);
    //   return { ...state, tasks: limitedTasks };
    // }
    default:
      return state;
  }
};