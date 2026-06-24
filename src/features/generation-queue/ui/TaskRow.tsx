import { motion } from 'framer-motion';
import { Card } from '@/shared/ui/card';
import { Ellipsis, X, ArrowDownToLine, RefreshCw } from 'lucide-react';
import { Task, TaskStatus } from '@/entities/generation-task/model/types';

const statusStyles: Record<TaskStatus, { background: string; color: string }> = {
  queued: { background: 'var(--color-secondary)', color: 'var(--c-fg-mute)' },
  inProgress: { background: 'var(--c-accent-soft)', color: 'var(--c-accent-2)' },
  completed: { background: '#10B98122', color: '#34D399' },
  error: { background: '#FF5A5A1F', color: '#FF6B6B' },
};

const actionIcons: Record<TaskStatus, React.ReactNode> = {
  queued: <X size={14} color="var(--c-fg-mute)" />,
  inProgress: <X size={14} color="var(--c-fg-mute)" />,
  completed: <ArrowDownToLine color="hsl(var(--primary))" size={14} />,
  error: <RefreshCw color="hsl(var(--primary))" size={14} />,
};

interface TaskRowProps {
  task: Task;
}

export const TaskRow = ({ task }: TaskRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border rounded-[14px] p-4 cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all flex items-start gap-3 group bg-card"
    >
      <div
        className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[hsl(var(--primary))/0.18]"
        style={{ background: 'rgba(232, 84, 32, 0.1)', border: '1px solid rgba(232, 84, 32, 0.2)' }}
      >
        <task.Icon className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} strokeWidth={1.75} />
      </div>

      <div className="flex-1 space-y-1">
        <h3 className="text-[14px] font-medium group-hover:text-primary transition-colors">
          {task.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" style={{ boxShadow: '0 0 8px var(--c-accent)' }} />
          <span>{task.model}</span>
          <span>•</span>
          <span>{task.estimatedTime}</span>
          <span>·</span>
          <span>{task.cost}</span>
        </div>
        {task.status === 'inProgress' && (
          <div className="space-y-0.5 pt-0.5">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${task.progress}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center justify-center">
        <div className="text-xs font-medium tabular-nums">
          {task.progress > 0 && task.progress !== 100 && <span>{task.progress} %</span>}
        </div>
        <div
          className="text-xs text-muted-foreground px-[10px] rounded-[8px] py-[5px]"
          style={{
            background: statusStyles[task.status].background,
            color: statusStyles[task.status].color,
          }}
        >
          {task.status}
        </div>
        <Card className="flex justify-center items-center h-[32px] w-[32px] rounded-[8px]">
          {actionIcons[task.status]}
        </Card>
        <Card className="flex justify-center items-center h-[32px] w-[32px] rounded-[8px]">
          <Ellipsis color="var(--c-fg-mute)" size={14} />
        </Card>
      </div>
    </motion.div>
  );
};