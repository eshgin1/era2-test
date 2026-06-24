import { Task, TaskStatus } from '@/entities/generation-task/model/types';

/**
 * Ограничивает количество задач в статусе 'inProgress' до максимума (по умолчанию 2).
 * Лишние задачи переводятся в статус 'queued'.
 */
export const enforceQueueLimit = (tasks: Task[], maxInProgress: number = 2): Task[] => {
  // Сортируем задачи по приоритету: сначала те, которые уже inProgress, потом queued, потом остальные.
  // Но нам нужно оставить в inProgress те, которые уже были inProgress, но не больше лимита.
  // Если их больше лимита, то лишние переводим в queued.
  // Также если есть задачи в queued, они не станут inProgress автоматически, только если освободится место.
  // Это правило применяется при изменении задач, чтобы соблюдать лимит.
  
  // Получаем все задачи inProgress
  const inProgressTasks = tasks.filter(t => t.status === 'inProgress');
  if (inProgressTasks.length <= maxInProgress) {
    // Если их меньше или равно лимиту, ничего не делаем
    return tasks;
  }

  // Сортируем inProgress задачи по дате создания (старые первыми? или новые? обычно старые должны выполняться раньше)
  // Но мы переводим в очередь те, которые позже добавлены (новые) – так логичнее, потому что старые уже обрабатываются.
  // Поэтому отсортируем по возрастанию createdAt (старые остаются inProgress)
  const sortedInProgress = [...inProgressTasks].sort((a, b) => a.createdAt - b.createdAt);
  // Оставляем первые maxInProgress как inProgress, остальные переводим в queued
  const toKeepInProgress = sortedInProgress.slice(0, maxInProgress);
  const toMoveToQueued = sortedInProgress.slice(maxInProgress);

  // Создаем map для быстрого обновления
  const taskMap = new Map(tasks.map(t => [t.id, t]));

  // Обновляем статусы для задач, которые переводим в queued
  toMoveToQueued.forEach(task => {
    taskMap.set(task.id, { ...task, status: 'queued' as TaskStatus, progress: 0 });
  });

  // Возвращаем массив с обновленными задачами
  return Array.from(taskMap.values());
};