import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { ChevronDown } from 'lucide-react';
import { TaskStatus } from '@/entities/generation-task/model/types';
import { SortOrder } from '../model/queueReducer';
import { useEffect, useRef, useState } from 'react';

const tabs: { label: string; status: TaskStatus | null }[] = [
  { label: 'Все', status: null },
  { label: 'В очереди', status: 'queued' },
  { label: 'Идет', status: 'inProgress' },
  { label: 'Готово', status: 'completed' },
  { label: 'Ошибка', status: 'error' },
];

interface QueueToolbarProps {
  activeStatus: TaskStatus | null;
  sortOrder: SortOrder;
  onFilterChange: (status: TaskStatus | null) => void;
  onSortChange: (order: SortOrder) => void;
}

export const QueueToolbar = ({
  activeStatus,
  sortOrder,
  onFilterChange,
  onSortChange,
}: QueueToolbarProps) => {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) setSortDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sortDropdownOpen]);
  
  return (
    <div className="flex gap-2 scrollbar-hide pb-1">
      {tabs.map((t) => (
        <Button
          key={t.label}
          onClick={() => onFilterChange(t.status)}
          variant="ghost"
          size="sm"
          className={cn(
            'px-4 py-2 rounded-full whitespace-nowrap transition-colors',
            t.status === activeStatus
              ? 'gradient-accent text-white'
              : 'border border-border hover:bg-accent/50'
          )}
        >
          {t.label}
        </Button>
      ))}

      <div className="relative inline-block ml-[34px]" ref={sortDropdownRef}>
        <Button
          variant="ghost"
          size="sm"
          className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
          onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          style={{ color: 'var(--c-fg-dim)' }}
        >
          <span>{sortOrder === 'newest' ? 'Сначала новые' : 'Сначала старые'}</span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-muted-foreground transition-transform',
              sortDropdownOpen && 'rotate-180'
            )}
          />
        </Button>

        {sortDropdownOpen && (
          <div
            className="absolute left-0 top-full mt-2 w-44 rounded-[14px] border p-1.5 shadow-2xl z-[42321500000]"
            style={{ background: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}
          >
            <button
              onClick={() => {
                onSortChange('newest');
                setSortDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-sm transition-colors text-left hover:bg-secondary"
            >
              <span>Сначала новые</span>
            </button>
            <button
              onClick={() => {
                onSortChange('oldest');
                setSortDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-sm transition-colors text-left hover:bg-secondary"
            >
              <span>Сначала старые</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};