import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { ChevronDown, Search } from 'lucide-react';
import { TaskStatus } from '@/entities/generation-task/model/types';
import { SortOrder } from '../model/queueReducer';
import { useEffect, useRef, useState } from 'react';
import { GenType } from '@/entities/generation';

const tabs: { label: string; status: TaskStatus | null }[] = [
  { label: 'Все', status: null },
  { label: 'В очереди', status: 'queued' },
  { label: 'Идет', status: 'inProgress' },
  { label: 'Готово', status: 'completed' },
  { label: 'Ошибка', status: 'error' },
];

const typeOptions: { label: string; type: GenType | null }[] = [
  { label: 'Все типы', type: null },
  { label: 'Изображение', type: 'image' },
  { label: 'Видео', type: 'video' },
  { label: 'Аудио', type: 'audio' },
  { label: 'Текст', type: 'text' },
];

interface QueueToolbarProps {
  activeStatus: TaskStatus | null;
  activeType: GenType | null;
  sortOrder: SortOrder;
  searchQuery: string;
  onFilterChange: (status: TaskStatus | null) => void;
  onSortChange: (order: SortOrder) => void;
  onSearchChange: (query: string) => void;
  onTypeFilterChange: (type: GenType | null) => void;
}

export const QueueToolbar = ({
  activeStatus,
  activeType,
  sortOrder,
  searchQuery,
  onFilterChange,
  onSortChange,
  onSearchChange,
  onTypeFilterChange,
}: QueueToolbarProps) => {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const currentTypeLabel = typeOptions.find(opt => opt.type === activeType)?.label || 'Все типы';
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (!sortDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) setSortDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sortDropdownOpen]);

  useEffect(() => {
    if (!typeDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) setTypeDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [typeDropdownOpen]);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      onSearchChange(value);
    }, 200);
  };

  // Очищаем таймер при размонтировании
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);
  
  return (
    <>
    <div className="relative max-w-xl">
      <Search size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Поиск"
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow placeholder:text-muted-foreground"
      />
    </div>
    <div className="mt-[24px] flex flex-col gap-2 pb-1 sm:flex-row">
      <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide sm:flex sm:overflow-x-hidden">
        <div className="flex gap-1 flex-wrap">
          {tabs.map((t) => (
            <Button
              key={t.label}
              onClick={() => onFilterChange(t.status)}
              variant="ghost"
              size="sm"
              className={cn(
                'px-4 py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0',
                t.status === activeStatus
                  ? 'gradient-accent text-white'
                  : 'border border-border hover:bg-accent/50'
              )}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>
      <div className='flex gap-1 justify-center'>
        <div className="relative inline-block sm:ml-[34px]" ref={sortDropdownRef}>
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
              className="absolute left-0 top-full mt-2 w-44 rounded-[14px] border p-1.5 shadow-2xl z-1"
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

        <div className="relative inline-block" ref={typeDropdownRef}>
          <Button
            variant="ghost"
            size="sm"
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2"
            onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
            style={{ color: 'var(--c-fg-dim)' }}
          >
            <span>{currentTypeLabel}</span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-muted-foreground transition-transform',
                typeDropdownOpen && 'rotate-180'
              )}
            />
          </Button>

          {typeDropdownOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-44 rounded-[14px] border p-1.5 shadow-2xl z-1"
              style={{ background: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}
            >
              {typeOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    onTypeFilterChange(opt.type);
                    setTypeDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-sm transition-colors text-left hover:bg-secondary",
                    opt.type === activeType && "bg-primary/10 text-primary"
                  )}
                >
                  <span>{opt.label}</span>
                  {opt.type === activeType && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};