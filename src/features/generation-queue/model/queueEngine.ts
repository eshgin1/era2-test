import { useEffect, useRef } from 'react';
import { Task } from '@/entities/generation-task/model/types';

const MAX_CONCURRENT = 2;

const getTaskType = (task: Task): 'image' | 'video' | 'audio' | 'text' => {
  const model = task.model.toLowerCase();
  if (model.includes('kling') || model.includes('runway') || model.includes('sora')) return 'video';
  if (model.includes('elevenlabs')) return 'audio';
  if (model.includes('gpt')) return 'text';
  return 'image';
};

const getTickParams = (task: Task) => {
  const type = getTaskType(task);
  switch (type) {
    case 'video':
    case 'audio':
      return { delayMin: 500, delayMax: 800, stepMin: 1, stepMax: 3 };
    case 'image':
    case 'text':
    default:
      return { delayMin: 300, delayMax: 500, stepMin: 3, stepMax: 7 };
  }
};

export const useQueueEngine = (tasks: Task[], updateTask: (task: Task) => void) => {
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const tasksRef = useRef(tasks);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    const scheduleNextTick = (task: Task) => {
      const currentTask = tasksRef.current.find(t => t.id === task.id);
      if (!currentTask || currentTask.status !== 'inProgress') {
        // Если задача больше не inProgress, удаляем таймер
        if (timeoutRefs.current.has(task.id)) {
          clearTimeout(timeoutRefs.current.get(task.id)!);
          timeoutRefs.current.delete(task.id);
        }
        return;
      }

      const { delayMin, delayMax, stepMin, stepMax } = getTickParams(currentTask);
      const step = Math.floor(Math.random() * (stepMax - stepMin + 1)) + stepMin;
      const newProgress = Math.min(currentTask.progress + step, 100);

    //   Сбой с вероятностью 15% (если не завершён)
      const shouldFail = Math.random() < 0.15 && newProgress < 100;
      if (shouldFail) {
        updateTask({ ...currentTask, status: 'error', progress: currentTask.progress });
        timeoutRefs.current.delete(task.id);
        return;
      }

      updateTask({ ...currentTask, progress: newProgress });

      if (newProgress === 100) {
        updateTask({ ...currentTask, status: 'completed', progress: 100 });
        timeoutRefs.current.delete(task.id);
      } else {
        const delay = Math.floor(Math.random() * (delayMax - delayMin + 1)) + delayMin;
        const timeoutId = setTimeout(() => scheduleNextTick(task), delay);
        timeoutRefs.current.set(task.id, timeoutId);
      }
    };

    const manageQueue = () => {
      const currentTasks = tasksRef.current;
      const inProgress = currentTasks.filter(t => t.status === 'inProgress');
      const queued = currentTasks
        .filter(t => t.status === 'queued')
        .sort((a, b) => a.createdAt - b.createdAt);

      const slots = MAX_CONCURRENT - inProgress.length;
      for (let i = 0; i < Math.min(slots, queued.length); i++) {
        const task = queued[i];
        updateTask({ ...task, status: 'inProgress', progress: 0 });
      }

      for (const task of currentTasks) {
        if (task.status === 'inProgress') {
          if (!timeoutRefs.current.has(task.id)) {
            const { delayMin, delayMax } = getTickParams(task);
            const initialDelay = Math.floor(Math.random() * (delayMax - delayMin + 1)) + delayMin;
            const timeoutId = setTimeout(() => scheduleNextTick(task), initialDelay);
            timeoutRefs.current.set(task.id, timeoutId);
          }
        } else {
          // Если задача не inProgress, удаляем таймер
          if (timeoutRefs.current.has(task.id)) {
            clearTimeout(timeoutRefs.current.get(task.id)!);
            timeoutRefs.current.delete(task.id);
          }
        }
      }
    };

    const interval = setInterval(manageQueue, 500);
    manageQueue();

    return () => {
      clearInterval(interval);
      for (const [id, timeoutId] of timeoutRefs.current) {
        clearTimeout(timeoutId);
      }
      timeoutRefs.current.clear();
    };
  }, [updateTask]);
};