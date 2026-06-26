import { Button } from '@/shared/ui/button';
import { QueueStats } from '@/features/generation-queue/ui/QueueStats';
import { QueueToolbar } from '@/features/generation-queue/ui/QueueToolbar';
import { selectCounts, selectFilteredTasks } from '@/features/generation-queue/model/selectors';
import { useMemo, useState } from 'react';
import { useQueue } from '@/features/generation-queue/model/useQueue';
import { Undo2 } from 'lucide-react';
import { LoadingState } from '@/features/generation-queue/ui/states/LoadingState';
import { EmptyState } from '@/features/generation-queue/ui/states/EmptyState';
import { TaskCard } from '@/features/generation-queue/ui/TaskCard';

export const GenerationQueue = () => {
  const { tasks, activeStatus, sortOrder, activeType, searchQuery, setFilter, setSort, clearCompleted, setSearch, setTypeFilter, undoClearCompleted, isLoading} = useQueue();

  const filteredTasks = useMemo(() => selectFilteredTasks({ tasks, activeStatus, activeType, sortOrder, searchQuery }), [tasks, activeStatus, sortOrder, searchQuery, activeType]);
  const counts = useMemo(() => selectCounts(tasks), [tasks]);
  const [showUndo, setShowUndo] = useState(false);

  const handleClearCompleted = () => {
    clearCompleted();
    setShowUndo(true);
  };

  const handleUndo = () => {
    undoClearCompleted();
    setShowUndo(false);
  };

  const hasCompleted = counts.completed > 0;
  
  if (isLoading) {
    return <LoadingState />;
  }
  return (
    <div className="relative flex flex-col h-full px-[5%] py-[40px]">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold mb-0.5">Очередь генераций</h3>
          <h4 className="text-muted-foreground text-sm max-w-xl">Ваши задачи в реальном времени</h4>
        </div>
        <div className='flex max-[450px]:hidden'>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCompleted}
                disabled={!hasCompleted}
                >
                Очистить готовые
            </Button>
          {showUndo && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              className="flex items-center gap-1"
            >
              <Undo2 size={14} />
              Вернуть
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-[24px]">
        <QueueStats counts={counts} />
      </div>

      {/* Toolbar */}
      <div className="mt-[24px]">
        <QueueToolbar
          activeStatus={activeStatus}
          activeType={activeType}
          sortOrder={sortOrder}
          searchQuery={searchQuery}
          onFilterChange={setFilter}
          onSortChange={setSort}
          onSearchChange={setSearch}
          onTypeFilterChange={setTypeFilter}
        />
      </div>

      {/* Tasks list */}
      <div className="mt-[24px] space-y-2">
        {filteredTasks.length === 0 ? (
            <EmptyState searchQuery={searchQuery} hasFilters={!!(activeStatus || activeType)} />
        ) : (
            filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
        </div>
    </div>
  );
};