import { useEffect, useState, useCallback } from 'react';
import { useTreasureHunt } from './useTreasureHunt';

export const useEasterEggs = () => {
  const [typedSequence, setTypedSequence] = useState<string>('');
  const [showTruckGame, setShowTruckGame] = useState(false);
  const [scrollTimer, setScrollTimer] = useState<NodeJS.Timeout | null>(null);
  const { updateProgress } = useTreasureHunt();

  // Scroll to bottom detection for clue2
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10;
      
      if (scrolledToBottom) {
        // Start 3-second timer
        const timer = setTimeout(() => {
          updateProgress('clue2');
        }, 3000);
        setScrollTimer(timer);
      } else {
        // Clear timer if user scrolls up
        if (scrollTimer) {
          clearTimeout(scrollTimer);
          setScrollTimer(null);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [updateProgress, scrollTimer]);

  // Type "truck" to open game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setTypedSequence((prev) => {
        const newTyped = (prev + e.key).slice(-5).toLowerCase();
        if (newTyped === 'truck') {
          setShowTruckGame(true);
          return '';
        }
        return newTyped;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeTruckGame = useCallback(() => {
    setShowTruckGame(false);
  }, []);

  const onTruckGameWin = useCallback(() => {
    updateProgress('clue4');
  }, [updateProgress]);

  return {
    showTruckGame,
    closeTruckGame,
    onTruckGameWin,
  };
};
