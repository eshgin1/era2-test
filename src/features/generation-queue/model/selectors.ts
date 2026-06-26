import { Task, TaskStatus } from '@/entities/generation-task/model/types';
import { QueueState, SortOrder } from './queueReducer';
import { GenType } from '@/entities/generation';

const statusPriority: Record<TaskStatus, number> = {
  inProgress: 0,
  queued: 1,
  completed: 2,
  error: 3,
  cancelled: 4
};

interface FilterParams {
  tasks: Task[];
  activeStatus: TaskStatus | null;
  activeType: GenType | null;
  sortOrder: SortOrder;
  searchQuery: string;
}

export const selectCounts = (tasks: Task[]) => {
  return tasks.reduce(
    (acc, task) => {
      acc[task.status] += 1;
      return acc;
    },
    { queued: 0, inProgress: 0, completed: 0, error: 0 } as Record<TaskStatus, number>
  );
};

export const selectFilteredTasks = (state: FilterParams) => {
  let filtered = state.tasks;

  if (state.activeStatus !== null) {
    filtered = filtered.filter(task => task.status === state.activeStatus);
  }

  if (state.activeType !== null) {
    filtered = filtered.filter(task => task.type === state.activeType);
  }

  if (state.searchQuery.trim() !== '') {
    const query = state.searchQuery.trim().toLowerCase();
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.model.toLowerCase().includes(query)
    );
  }

  return filtered.sort((a, b) => {
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
    if (statusDiff !== 0) return statusDiff;
    if (state.sortOrder === 'newest') {
      return b.createdAt - a.createdAt;
    } else {
      return a.createdAt - b.createdAt;
    }
  });
};

export const selectSortedAllTasks = (state: QueueState) => {
  return [...state.tasks].sort((a, b) => {
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
    if (statusDiff !== 0) return statusDiff;
    if (state.sortOrder === 'newest') {
      return b.createdAt - a.createdAt;
    } else {
      return a.createdAt - b.createdAt;
    }
  });
};