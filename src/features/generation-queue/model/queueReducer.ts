import { GenType } from '@/entities/generation';
import { Task, TaskStatus } from '@/entities/generation-task/model/types';

export type SortOrder = 'newest' | 'oldest';

export interface QueueState {
  tasks: Task[];
  activeStatus: TaskStatus | null;
  deletedTasks: Task[];
  activeType: GenType | null;
  sortOrder: SortOrder;
  searchQuery: string;
  isLoading: boolean;
}

export type QueueAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_FILTER'; payload: TaskStatus | null }
  | { type: 'SET_TYPE_FILTER'; payload: GenType | null }
  | { type: 'SET_SORT'; payload: SortOrder }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'UNDO_CLEAR_COMPLETED' }
  | { type: 'REMOVE_TASK'; payload: string }
  | { type: 'CANCEL_TASK'; payload: string }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

export const queueReducer = (state: QueueState, action: QueueAction): QueueState => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_FILTER':
      return { ...state, activeStatus: action.payload };
    case 'SET_TYPE_FILTER':
      return { ...state, activeType: action.payload  };
    case 'SET_SORT':
      return { ...state, sortOrder: action.payload };
    case 'CLEAR_COMPLETED': {
      const completed = state.tasks.filter(t => t.status === 'completed');
      const remaining = state.tasks.filter(t => t.status !== 'completed');
      return {
        ...state,
        tasks: remaining,
        deletedTasks: completed,
      };
    }
    case 'UNDO_CLEAR_COMPLETED': {
      if (state.deletedTasks.length === 0) return state;
      return {
        ...state,
        tasks: [...state.tasks, ...state.deletedTasks],
        deletedTasks: [],
      };
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
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_LOADING': {
      return { ...state, isLoading: action.payload };
    }
    default:
      return state;
  }
};