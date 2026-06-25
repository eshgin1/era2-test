import { Task, TaskStatus } from '@/entities/generation-task/model/types';

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
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'REMOVE_TASK'; payload: string }
  | { type: 'CANCEL_TASK'; payload: string };

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
    case 'REMOVE_TASK': {
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    }
    case 'CANCEL_TASK': {
      const index = state.tasks.findIndex(t => t.id === action.payload);
      if (index === -1) return state;
      const newTasks = [...state.tasks];
      newTasks[index] = { 
        ...newTasks[index], 
        status: 'cancelled', 
        progress: 0, 
        estimatedTime: null,
      };
      return { ...state, tasks: newTasks };
    }
    case 'UPDATE_TASK': {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index === -1) return state;
      const newTasks = [...state.tasks];
      newTasks[index] = action.payload;
      return { ...state, tasks: newTasks };
    }
    default:
      return state;
  }
};