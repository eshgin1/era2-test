import { Loader2 } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="mt-4 text-sm text-muted-foreground">Загрузка задач...</p>
    </div>
  );
};