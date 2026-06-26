import { Card } from '@/shared/ui/card';
import { X, ArrowDownToLine, RefreshCw } from 'lucide-react';
import { TaskStatus } from '@/entities/generation-task/model/types';

const actionIcons: Record<TaskStatus, React.ReactNode> = {
  queued: <X size={14} color="var(--c-fg-mute)" />,
  inProgress: <X size={14} color="var(--c-fg-mute)" />,
  completed: <ArrowDownToLine color="hsl(var(--primary))" size={14} />,
  error: <RefreshCw color="hsl(var(--primary))" size={14} />,
  cancelled: <RefreshCw color="hsl(var(--primary))" size={14} />,
};

interface TaskActionProps {
  status: TaskStatus;
  onClick: () => void;
}

export const TaskAction = ({ status, onClick }: TaskActionProps) => {
  return (
    <Card
      onClick={onClick}
      className="flex justify-center items-center h-[32px] w-[32px] rounded-[8px] cursor-pointer hover:bg-accent/50 transition-colors"
    >
      {actionIcons[status]}
    </Card>
  );
};