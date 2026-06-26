import { TaskStatus } from '@/entities/generation-task/model/types';
import { cn } from '@/shared/lib/utils';

const statusStyles: Record<TaskStatus, { background: string; color: string }> = {
  queued: { background: 'var(--color-secondary)', color: 'var(--c-fg-mute)' },
  inProgress: { background: 'var(--c-accent-soft)', color: 'var(--c-accent-2)' },
  completed: { background: '#10B98122', color: '#34D399' },
  error: { background: '#FF5A5A1F', color: '#FF6B6B' },
  cancelled: { background: '#6B728022', color: 'var(--c-fg-mute)' },
};

const statusLabels: Record<TaskStatus, string> = {
  queued: 'В очереди',
  inProgress: 'Идет',
  completed: 'Готово',
  error: 'Ошибка',
  cancelled: 'Отменено',
};

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <div
      className={cn(
        "text-xs text-muted-foreground px-[10px] rounded-[8px] py-[5px]",
        className
      )}
      style={{
        background: statusStyles[status].background,
        color: statusStyles[status].color,
      }}
    >
      {statusLabels[status]}
    </div>
  );
};