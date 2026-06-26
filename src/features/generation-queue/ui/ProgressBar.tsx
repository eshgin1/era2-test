interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="space-y-0.5 pt-0.5">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};