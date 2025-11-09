import { useEffect, useCallback } from 'react';
import { ClueProgress } from '@/components/TreasureHunt';
import { toast } from 'sonner';

export const useTreasureHunt = () => {
  const updateProgress = useCallback((clue: keyof ClueProgress) => {
    const savedProgress = localStorage.getItem('treasureHuntProgress');
    const progress: ClueProgress = savedProgress
      ? JSON.parse(savedProgress)
      : {
          clue1: false,
          clue2: false,
          clue3: false,
          clue4: false,
          clue5: false,
        };

    if (!progress[clue]) {
      progress[clue] = true;
      localStorage.setItem('treasureHuntProgress', JSON.stringify(progress));
      toast.success('🗺️ Clue found! Check your treasure map.');
      return true;
    }
    return false;
  }, []);

  const getProgress = useCallback((): ClueProgress => {
    const savedProgress = localStorage.getItem('treasureHuntProgress');
    return savedProgress
      ? JSON.parse(savedProgress)
      : {
          clue1: false,
          clue2: false,
          clue3: false,
          clue4: false,
          clue5: false,
        };
  }, []);

  const resetProgress = useCallback(() => {
    localStorage.removeItem('treasureHuntProgress');
    toast.info('Treasure hunt progress reset');
  }, []);

  return { updateProgress, getProgress, resetProgress };
};
