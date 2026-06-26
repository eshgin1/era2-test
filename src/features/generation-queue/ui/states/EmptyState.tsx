import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  searchQuery?: string;
  hasFilters: boolean;
}

export const EmptyState = ({ searchQuery, hasFilters }: EmptyStateProps) => {
  let title = 'Ничего не найдено';
  let description = 'Попробуйте изменить параметры фильтрации или поиска';

  if (!hasFilters && !searchQuery) {
    title = 'Задачи пока отсутствуют';
    description = 'Новые задачи появятся здесь после начала генерации';
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="w-12 h-12 text-muted-foreground/30 mb-4" />
      <div className="text-muted-foreground text-lg font-medium mb-1">{title}</div>
      <p className="text-sm text-muted-foreground/70 max-w-sm">{description}</p>
    </div>
  );
};