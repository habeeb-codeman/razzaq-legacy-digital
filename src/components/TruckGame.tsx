import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { Button } from './ui/button';

interface TruckGameProps {
  onClose: () => void;
  onWin: () => void;
}

const TruckGame = ({ onClose, onWin }: TruckGameProps) => {
  const [truckPosition, setTruckPosition] = useState(50);
  const [obstacles, setObstacles] = useState<{ id: number; position: number; lane: number }[]>([]);
  const [collectibles, setCollectibles] = useState<{ id: number; position: number; lane: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const winningScore = 15;

  const lanes = [25, 50, 75];

  const moveLeft = useCallback(() => {
    setTruckPosition((prev) => {
      const currentIndex = lanes.indexOf(prev);
      return currentIndex > 0 ? lanes[currentIndex - 1] : prev;
    });
  }, []);

  const moveRight = useCallback(() => {
    setTruckPosition((prev) => {
      const currentIndex = lanes.indexOf(prev);
      return currentIndex < lanes.length - 1 ? lanes[currentIndex + 1] : prev;
    });
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || won) return;
      if (e.key === 'ArrowLeft') moveLeft();
      if (e.key === 'ArrowRight') moveRight();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveLeft, moveRight, gameOver, won]);

  useEffect(() => {
    if (gameOver || won) return;

    const gameLoop = setInterval(() => {
      // Move obstacles and collectibles down
      setObstacles((prev) =>
        prev
          .map((obs) => ({ ...obs, position: obs.position + 2 }))
          .filter((obs) => obs.position < 100)
      );

      setCollectibles((prev) =>
        prev
          .map((col) => ({ ...col, position: col.position + 2 }))
          .filter((col) => col.position < 100)
      );

      // Spawn new obstacles
      if (Math.random() > 0.97) {
        const lane = lanes[Math.floor(Math.random() * lanes.length)];
        setObstacles((prev) => [
          ...prev,
          { id: Date.now(), position: -10, lane },
        ]);
      }

      // Spawn new collectibles (parts)
      if (Math.random() > 0.96) {
        const lane = lanes[Math.floor(Math.random() * lanes.length)];
        setCollectibles((prev) => [
          ...prev,
          { id: Date.now(), position: -10, lane },
        ]);
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameOver, won]);

  useEffect(() => {
    if (gameOver || won) return;

    // Check collisions with obstacles
    obstacles.forEach((obs) => {
      if (
        obs.lane === truckPosition &&
        obs.position > 75 &&
        obs.position < 95
      ) {
        setGameOver(true);
      }
    });

    // Check collection of parts
    collectibles.forEach((col) => {
      if (
        col.lane === truckPosition &&
        col.position > 75 &&
        col.position < 95
      ) {
        setScore((prev) => prev + 1);
        setCollectibles((prev) => prev.filter((c) => c.id !== col.id));
      }
    });
  }, [obstacles, collectibles, truckPosition, gameOver, won]);

  useEffect(() => {
    if (score >= winningScore && !won) {
      setWon(true);
      onWin();
    }
  }, [score, won, onWin]);

  const restartGame = () => {
    setTruckPosition(50);
    setObstacles([]);
    setCollectibles([]);
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-12 right-0 text-foreground"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>

        <div className="frosted-glass p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-heading font-bold">🚛 Truck Parts Challenge</h2>
            <div className="text-xl font-bold">
              Score: {score}/{winningScore}
            </div>
          </div>

          <p className="text-muted-foreground mb-4">
            Use ← → arrow keys to move. Collect parts (🔧), avoid obstacles (🚧)!
          </p>

          {/* Game Canvas */}
          <div className="relative w-full h-96 bg-gradient-to-b from-muted/20 to-muted/40 rounded-xl overflow-hidden border-2 border-border">
            {/* Road lanes */}
            <div className="absolute inset-0 flex">
              {lanes.map((lane) => (
                <div
                  key={lane}
                  className="flex-1 border-r border-dashed border-border/30"
                />
              ))}
            </div>

            {/* Obstacles */}
            {obstacles.map((obs) => (
              <div
                key={obs.id}
                className="absolute text-3xl transition-all"
                style={{
                  left: `${obs.lane}%`,
                  top: `${obs.position}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                🚧
              </div>
            ))}

            {/* Collectibles */}
            {collectibles.map((col) => (
              <div
                key={col.id}
                className="absolute text-2xl transition-all animate-pulse"
                style={{
                  left: `${col.lane}%`,
                  top: `${col.position}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                🔧
              </div>
            ))}

            {/* Player Truck */}
            <div
              className="absolute text-4xl transition-all duration-200"
              style={{
                left: `${truckPosition}%`,
                top: '85%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              🚛
            </div>

            {/* Game Over / Win Overlay */}
            {(gameOver || won) && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                {won ? (
                  <>
                    <Trophy className="w-16 h-16 text-accent mb-4" />
                    <h3 className="text-3xl font-bold text-accent mb-2">
                      You Won! 🎉
                    </h3>
                    <p className="text-lg mb-4">
                      You're one step closer to the treasure!
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-3xl font-bold text-destructive mb-2">
                      Game Over!
                    </h3>
                    <p className="text-lg mb-4">Score: {score}</p>
                  </>
                )}
                <Button onClick={restartGame} className="btn-accent">
                  Try Again
                </Button>
              </div>
            )}
          </div>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Tip: This game might be part of something bigger... 🗺️
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TruckGame;
