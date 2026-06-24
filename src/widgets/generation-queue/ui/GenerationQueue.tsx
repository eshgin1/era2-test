import { Button } from '@/shared/ui/button';
import { QueueStats } from '@/features/generation-queue/ui/QueueStats';
import { QueueToolbar } from '@/features/generation-queue/ui/QueueToolbar';
import { TaskRow } from '@/features/generation-queue/ui/TaskRow';
import { selectCounts, selectFilteredTasks } from '@/features/generation-queue/model/selectors';
import { useMemo } from 'react';
import { useQueue } from '@/features/generation-queue/model/useQueue';

export const GenerationQueue = () => {
  const { tasks, activeStatus, sortOrder, setFilter, setSort, clearCompleted } = useQueue();

  const filteredTasks = useMemo(() => selectFilteredTasks({ tasks, activeStatus, sortOrder }), [tasks, activeStatus, sortOrder]);
  const counts = useMemo(() => selectCounts(tasks), [tasks]);

  return (
    <div className="relative flex flex-col h-full px-[160px] py-[40px]">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold mb-0.5">Очередь генераций</h3>
          <h4 className="text-muted-foreground text-sm max-w-xl">Ваши задачи в реальном времени</h4>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCompleted}>
          Очистить готовые
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-[24px]">
        <QueueStats counts={counts} />
      </div>

      {/* Toolbar */}
      <div className="mt-[24px]">
        <QueueToolbar
          activeStatus={activeStatus}
          sortOrder={sortOrder}
          onFilterChange={setFilter}
          onSortChange={setSort}
        />
      </div>

      {/* Tasks list */}
      <div className="mt-[24px] space-y-2">
        {filteredTasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};