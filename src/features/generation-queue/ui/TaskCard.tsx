import { motion } from 'framer-motion';
import { Card as UICard } from '@/shared/ui/card';
import { Ellipsis, Circle } from 'lucide-react';
import { Task } from '@/entities/generation-task/model/types';
import { typeIcons } from '@/features/generation-queue/lib/typeIcons';
import { StatusBadge } from '@/features/generation-queue/ui/StatusBadge';
import { ProgressBar } from '@/features/generation-queue/ui/ProgressBar';
import { TaskAction } from '@/features/generation-queue/ui/TaskActions';
import { cn } from '@/shared/lib/utils';
import { formatEta } from '@/features/generation-queue/lib/formatEta';
import { useQueue } from '@/features/generation-queue/model/useQueue';
import { useRef, useState, useEffect, useMemo } from 'react';


interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const { tasks, updateTask, removeTask, cancelTask, getTaskPosition } = useQueue();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const Icon = typeIcons[task.type] || Circle;

  const handleActionClick = () => {
    if (task.status === 'queued' || task.status === 'inProgress') {
      cancelTask(task.id);
      return;
    }
    if (task.status === 'error' || task.status === 'cancelled') {
      const inProgressCount = tasks.filter(t => t.status === 'inProgress').length;
      const newStatus = inProgressCount < 2 ? 'inProgress' : 'queued';
      updateTask({ ...task, status: newStatus, progress: 0 });
    }
  };

  const handleDelete = () => {
    removeTask(task.id);
    setIsMenuOpen(false);
  };

  const errorMessage = useMemo(() => {
    const errorMessages = [
      'Недостаточно кредитов',
      'Превышено время ожидания',
      'Модель временно недоступна',
    ];
    return errorMessages[Math.floor(Math.random() * errorMessages.length)];
  }, []);
  
  const renderInfo = () => {
    switch (task.status) {
      case 'inProgress':
        return (
          <>
            <span>≈</span>
            <span>{formatEta(task.estimatedTime)}</span>
            <span>•</span>
            <span>{task.cost} cr</span>
          </>
        );
      case 'queued':
        return (
          <>
            <span>Позиция в очереди {getTaskPosition(task.id)}</span>
          </>
        );
      case 'completed':
        return (
          <>
            <span>Готово за {task.estimatedTime}</span>
            <span>•</span>
            <span>{task.cost} cr</span>
          </>
        );
      case 'error':
        return (
          <>
            <span>{errorMessage}</span>
          </>
        );
      case 'cancelled':
        return (
          <>
            <span>Отменено пользователем</span>
          </>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "rounded-[14px] p-4 cursor-pointer hover:shadow-sm transition-all flex flex-wrap items-start gap-3 group bg-card",
      task.status === 'inProgress'
        ? "border-2 border-accent/70 hover:border-accent"
        : "border border-border hover:border-primary/30"
    )}
  >
    {/* Иконка */}
    <div
      className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[hsl(var(--primary))/0.18]"
      style={{ background: 'rgba(232, 84, 32, 0.1)', border: '1px solid rgba(232, 84, 32, 0.2)' }}
    >
      <Icon className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} strokeWidth={1.75} />
    </div>

    {/* Центральный блок (заголовок, метаданные, прогресс) */}
    <div className="flex-1 min-w-0 space-y-1">
      <h3 className={cn(
        "text-[14px] font-medium group-hover:text-primary transition-colors",
        "sm:truncate"
      )}>
        {task.title}
      </h3>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-primary" style={{ boxShadow: '0 0 8px var(--c-accent)' }} />
        <span>{task.model}</span>
        <span>•</span>
        {renderInfo()}
      </div>
      {task.status === 'inProgress' && <ProgressBar progress={task.progress} />}
    </div>

    {/* Правый блок (проценты, статус, действия) — переносится на новую строку на экранах < sm */}
    <div className="flex gap-2 items-center justify-between w-full sm:w-auto sm:flex-shrink-0 sm:justify-center">
      <div className='flex gap-1 items-center'>
        {task.progress > 0 && task.progress !== 100 && task.status === 'inProgress' && (
          <span className="text-xs font-medium tabular-nums">{task.progress} %</span>
        )}
        <StatusBadge status={task.status} />
      </div>
      <div className='flex gap-1 items-center'>
      <TaskAction status={task.status} onClick={handleActionClick} />
      <div className="relative" ref={buttonRef}>
        <UICard
          className="flex justify-center items-center h-[32px] w-[32px] rounded-[8px] cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Ellipsis color="var(--c-fg-mute)" size={14} />
        </UICard>
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-1 rounded-md border bg-popover shadow-md z-50 py-1"
            style={{ background: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}
          >
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-secondary transition-colors text-left text-destructive"
            >
              Удалить
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  </motion.div>
  );
};