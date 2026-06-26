import React, { createContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { queueReducer, QueueState, SortOrder } from './queueReducer';
import { TaskStatus, Task } from '@/entities/generation-task/model/types';
import { initialTasks } from '@/entities/generation-task/model/seet';
import { selectSortedAllTasks } from './selectors';
import { GenType } from '@/entities/generation';
import { useQueueEngine } from './queueEngine';

const STORAGE_KEY = 'generationQueueState';

interface QueueContextValue extends QueueState {
  setFilter: (status: TaskStatus | null) => void;
  setTypeFilter: (type: GenType | null) => void;
  setSort: (order: SortOrder) => void;
  clearCompleted: () => void; 
  undoClearCompleted: () => void; 
  removeTask: (id: string) => void;
  cancelTask: (id: string) => void;
  updateTask: (task: Task) => void;
  getTaskPosition: (id: string) => number;
  setSearch: (query: string) => void;
  isLoading: boolean;
}

const QueueContext = createContext<QueueContextValue | undefined>(undefined);

const loadState = (): QueueState | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    const parsed = JSON.parse(serialized);
    const tasks = parsed.tasks.map((task: Task) => {
      if (task.status === 'inProgress') {
        return { ...task, status: 'queued' as TaskStatus, progress: 0 };
      }
      return task;
    });
    return { ...parsed, tasks };
  } catch (error) {
    console.error('Failed to load state from localStorage', error);
    return null;
  }
};

const saveState = (state: QueueState) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save state to localStorage', error);
  }
};

const getInitialState = (): QueueState => {
  const saved = loadState();
  if (saved) {
    return {
      ...saved,
      activeStatus: saved.activeStatus ?? null,
      activeType: saved.activeType ?? null,
      sortOrder: saved.sortOrder ?? 'newest',
      searchQuery: saved.searchQuery ?? '',
      deletedTasks: saved.deletedTasks ?? [],
    };
  }
  return {
    tasks: initialTasks,
    deletedTasks: [],
    activeStatus: null,
    activeType: null,
    sortOrder: 'newest',
    searchQuery: '',
    isLoading: true
  };
};


export const QueueProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(queueReducer, getInitialState());

  useEffect(() => {
    saveState(state);
  }, [state]);
  
  useEffect(() => {
    if (state.isLoading) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [state.isLoading]);

  const setFilter = (status: TaskStatus | null) => {
    dispatch({ type: 'SET_FILTER', payload: status });
  };
  
  const setTypeFilter = (type: GenType | null) => {
    dispatch({ type: 'SET_TYPE_FILTER', payload: type });
  };

  const setSort = (order: SortOrder) => {
    dispatch({ type: 'SET_SORT', payload: order });
  };

  const clearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  };
  
  const undoClearCompleted = () => {
    dispatch({ type: 'UNDO_CLEAR_COMPLETED' });
  };

  const removeTask = (id: string) => {
    dispatch({ type: 'REMOVE_TASK', payload: id });
   };
   
   const cancelTask = (id: string) => {
    dispatch({ type: 'CANCEL_TASK', payload: id });
  };

  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };
  
  const getTaskPosition = (taskId: string): number => {
    const sorted = selectSortedAllTasks(state);
    const inProgressCount = state.tasks.filter(t => t.status === 'inProgress').length;
    const queuedTasks = sorted.filter(t => t.status === 'queued');
    const index = queuedTasks.findIndex(t => t.id === taskId);
    if (index === -1) return -1;
    return inProgressCount + index + 1;
  };
  
  const setSearch = (query: string) => {
    dispatch({ type: 'SET_SEARCH', payload: query });
  };
  
  useQueueEngine(state.tasks, updateTask);
  
  const value: QueueContextValue = {
    ...state,
    setFilter,
    setTypeFilter,
    setSort,
    clearCompleted,
    undoClearCompleted,
    removeTask,
    cancelTask,
    updateTask,
    getTaskPosition,
    setSearch
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};

export const useQueueContext = () => {
  const ctx = React.useContext(QueueContext);
  if (!ctx) throw new Error('useQueueContext must be used within QueueProvider');
  return ctx;
};