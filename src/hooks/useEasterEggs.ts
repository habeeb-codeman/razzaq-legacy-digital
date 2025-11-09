import { useEffect, useState, useCallback } from 'react';
import { useTreasureHunt } from './useTreasureHunt';

export const useEasterEggs = () => {
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [typedSequence, setTypedSequence] = useState<string>('');
  const [showTruckGame, setShowTruckGame] = useState(false);
  const { updateProgress } = useTreasureHunt();

  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  // Konami Code Easter Egg
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKonamiSequence((prev) => {
        const newSequence = [...prev, e.key].slice(-10);
        
        // Check if konami code is complete
        const matches = konamiCode.every((key, index) => newSequence[index] === key);
        if (matches && newSequence.length === konamiCode.length) {
          updateProgress('clue2');
          return [];
        }
        
        return newSequence;
      });

      // Type "truck" to open game
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
  }, [updateProgress]);

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
