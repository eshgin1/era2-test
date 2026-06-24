import { Task, TaskStatus } from '@/entities/generation-task/model/types';
import { QueueState, SortOrder } from './queueReducer';

const statusPriority: Record<TaskStatus, number> = {
  inProgress: 0,
  queued: 1,
  completed: 2,
  error: 3,
};

export const selectCounts = (tasks: Task[]) => {
  return tasks.reduce(
    (acc, task) => {
      acc[task.status] += 1;
      return acc;
    },
    { queued: 0, inProgress: 0, completed: 0, error: 0 } as Record<TaskStatus, number>
  );
};

export const selectFilteredTasks = (state: QueueState) => {
  let filtered = state.tasks;
  if (state.activeStatus !== null) {
    filtered = filtered.filter(task => task.status === state.activeStatus);
  }

  return [...filtered].sort((a, b) => {
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
    if (statusDiff !== 0) return statusDiff;

    if (state.sortOrder === 'newest') {
      return b.createdAt - a.createdAt;
    } else {
      return a.createdAt - b.createdAt;
    }
  });
};