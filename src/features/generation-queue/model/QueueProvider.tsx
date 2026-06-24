import React, { createContext, useReducer, ReactNode } from 'react';
import { queueReducer, QueueState, SortOrder } from './queueReducer';
import { TaskStatus, Task } from '@/entities/generation-task/model/types';
import { initialTasks } from '@/entities/generation-task/model/seet';

interface QueueContextValue extends QueueState {
  setFilter: (status: TaskStatus | null) => void;
  setSort: (order: SortOrder) => void;
  clearCompleted: () => void; 
//   updateTask: (task: Task) => void;
}

const QueueContext = createContext<QueueContextValue | undefined>(undefined);

const initialState: QueueState = {
  tasks: initialTasks,
  activeStatus: null,
  sortOrder: 'newest',
};

export const QueueProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(queueReducer, initialState);

  const setFilter = (status: TaskStatus | null) => {
    dispatch({ type: 'SET_FILTER', payload: status });
  };

  const setSort = (order: SortOrder) => {
    dispatch({ type: 'SET_SORT', payload: order });
  };

  const clearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  };

//   const updateTask = (task: Task) => {
//     dispatch({ type: 'UPDATE_TASK', payload: task });
//   };

  const value: QueueContextValue = {
    ...state,
    setFilter,
    setSort,
    clearCompleted,
    // updateTask,
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};

export const useQueueContext = () => {
  const ctx = React.useContext(QueueContext);
  if (!ctx) throw new Error('useQueueContext must be used within QueueProvider');
  return ctx;
};