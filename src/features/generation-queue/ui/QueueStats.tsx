import { TaskStatus } from '@/entities/generation-task/model/types';

const statusBlocks: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'queued', label: 'В очереди', color: 'var(--c-fg-mute)' },
  { key: 'inProgress', label: 'Идет', color: 'var(--c-accent)' },
  { key: 'completed', label: 'Готово', color: '#34d399' },
  { key: 'error', label: 'Ошибка', color: '#FF6B6B' },
];

interface QueueStatsProps {
  counts: Record<TaskStatus, number>;
}

export const QueueStats = ({ counts }: QueueStatsProps) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {statusBlocks.map((block) => (
        <div
          key={block.key}
          className="px-[18px] py-[16px] flex flex-col border border-border rounded-[14px] p-4 cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all items-start gap-1 group bg-card"
        >
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: block.color }} />
            <p className="text-[13px]" style={{ color: block.color }}>
              {block.label}
            </p>
          </div>
          <h3 className="text-xl font-semibold">{counts[block.key]}</h3>
        </div>
      ))}
    </div>
  );
};