export const formatEta = (seconds: number | null | undefined): string => {
  if (seconds === null || seconds === undefined) return '…';
  
  if (seconds < 60) {
    return `${Math.floor(seconds)} сек`;
  }
  
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} мин`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (minutes === 0) return `${hours} ч`;
  return `${hours} ч ${minutes} мин`;
};