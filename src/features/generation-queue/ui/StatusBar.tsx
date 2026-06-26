'use client';

import { useQueue } from '@/features/generation-queue/model/useQueue';
import { ProgressBar } from '@/features/generation-queue/ui/ProgressBar';
import { StatusBadge } from '@/features/generation-queue/ui/StatusBadge';
import { Button } from '@/shared/ui/button';
import { Task } from '@/entities/generation-task/model/types';
import { typeIcons } from '../lib/typeIcons';
import { Circle, Moon, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from '@/shared/routing';

const MAX_DISPLAY = 3;

export const StatusBar = () => {
  const { tasks } = useQueue();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();
  const activeTasks = tasks.filter(
    (t) => t.status === 'inProgress' || t.status === 'queued'
  );

  const sorted = [...activeTasks].sort((a, b) => {
    if (a.status === 'inProgress' && b.status === 'queued') return -1;
    if (a.status === 'queued' && b.status === 'inProgress') return 1;
    return 0;
  });

  const inProgressTasks = tasks.filter((t) => t.status === 'inProgress');
  const inProgressCount = inProgressTasks.length;
  const totalProgress =
    inProgressCount > 0
      ? Math.round(
          inProgressTasks.reduce((sum, t) => sum + t.progress, 0) / inProgressCount
        )
      : 0;

  const displayTasks = sorted.slice(0, MAX_DISPLAY);
  const remaining = sorted.length - MAX_DISPLAY;

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

return (
  <div className="bottom-6 right-6 z-50 w-85 bg-card border border-border rounded-2xl shadow-2xl p-4 transition-all hover:shadow-xl">
    <div className="cursor-pointer flex justify-between gap-1" onClick={toggleCollapse}>
      <div className="flex flex-col gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Moon size={18} style={{ color: 'var(--c-accent)' }} />
            <span className="text-sm font-semibold">
              {inProgressCount > 0 ? 'Генерации идут' : 'Нет активных генераций'}
            </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {inProgressCount} активны · {totalProgress}%
          </span>
        </div>
      </div>
      {isCollapsed ? (
        <ChevronUp size={16} className="text-muted-foreground" />
      ) : (
        <ChevronDown size={16} className="text-muted-foreground" />
      )}
    </div>

    <AnimatePresence>
      {!isCollapsed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="space-y-3 pt-3">
            <div className="space-y-2">
              {displayTasks.map((task) => (
                <TaskPreview key={task.id} task={task} />
              ))}
              {remaining > 0 && (
                <div className="text-xs text-muted-foreground text-center py-1">
                  + ещё {remaining} {remaining === 1 ? 'задача' : 'задачи'}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-primary hover:text-primary/80 hover:bg-primary/10 justify-center group"
              onClick={() => navigate('/queue')}
            >
              <span>Открыть очередь</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
};

const TaskPreview = ({ task }: { task: Task }) => {
  const Icon = typeIcons[task.type] || Circle;
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 bg-primary/10 border border-primary/20">
        <Icon className="w-3 h-3 text-primary" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0 ">
        <div className="flex items-center justify-between gap-2 ">
          <span className="text-sm truncate">{task.title}</span>
          <StatusBadge status={task.status} className="text-[10px] px-2 py-0.5 whitespace-nowrap" />
        </div>
        {task.status === 'inProgress' && (
          <div className="mt-0.5">
            <ProgressBar progress={task.progress} className="h-1" />
          </div>
        )}
      </div>
    </div>
  );
};