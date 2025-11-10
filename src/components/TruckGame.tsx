import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Zap } from 'lucide-react';
import { Button } from './ui/button';

interface TruckGameProps {
  onClose: () => void;
  onWin: () => void;
}

interface GameObject {
  id: number;
  position: number;
  lane: number;
  type: 'part' | 'obstacle' | 'bonus';
  icon: string;
}

const TruckGame = ({ onClose, onWin }: TruckGameProps) => {
  const [truckPosition, setTruckPosition] = useState(50);
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
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

  // Spawn game objects with varying difficulty
  useEffect(() => {
    if (gameOver || won) return;

    const spawnRate = Math.max(800, 1500 - score * 50);

    const interval = setInterval(() => {
      const rand = Math.random();
      let type: 'part' | 'obstacle' | 'bonus';
      let icon: string;

      if (rand > 0.9) {
        type = 'bonus';
        icon = '⚡'; // Bonus gives 3 points
      } else if (rand > 0.55) {
        type = 'part';
        icon = ['🔧', '⚙️', '🔩', '🛞'][Math.floor(Math.random() * 4)];
      } else {
        type = 'obstacle';
        icon = ['🚧', '⚠️', '💥', '🛑'][Math.floor(Math.random() * 4)];
      }

      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      
      setGameObjects((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), position: -10, lane, type, icon },
      ]);
    }, spawnRate);

    return () => clearInterval(interval);
  }, [gameOver, won, score]);

  // Move objects and check collisions
  useEffect(() => {
    if (gameOver || won) return;

    const moveSpeed = Math.min(3, 1.5 + score * 0.1);

    const gameLoop = setInterval(() => {
      setGameObjects((prev) => {
        const updated = prev.map((obj) => ({ ...obj, position: obj.position + moveSpeed }));
        
        // Check collisions
        updated.forEach((obj) => {
          if (
            obj.lane === truckPosition &&
            obj.position > 75 &&
            obj.position < 95
          ) {
            if (obj.type === 'part') {
              setScore((s) => s + 1);
              setCombo((c) => c + 1);
              // Remove collected object
              setGameObjects((objs) => objs.filter((o) => o.id !== obj.id));
            } else if (obj.type === 'bonus') {
              setScore((s) => s + 3);
              setCombo((c) => c + 1);
              setGameObjects((objs) => objs.filter((o) => o.id !== obj.id));
            } else {
              setGameOver(true);
              setCombo(0);
            }
          }
        });

        return updated.filter((obj) => obj.position < 100);
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameOver, won, truckPosition, score]);

  // Reset combo if too much time passes
  useEffect(() => {
    if (combo > 0) {
      const timer = setTimeout(() => setCombo(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [combo]);

  useEffect(() => {
    if (score >= winningScore && !won) {
      setWon(true);
      onWin();
    }
  }, [score, won, onWin]);

  const restartGame = () => {
    setTruckPosition(50);
    setGameObjects([]);
    setScore(0);
    setCombo(0);
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
          <div className="text-center mb-4">
            <h2 className="text-2xl font-heading font-bold mb-2">
              🚛 Truck Parts Challenge
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              Collect parts 🔧⚙️🔩🛞 | Avoid obstacles 🚧⚠️💥🛑 | Grab bonuses ⚡
            </p>
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <div className="text-xl font-bold">
                Score: {score}/{winningScore}
              </div>
              <AnimatePresence>
                {combo > 2 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-1 text-accent font-bold px-3 py-1 bg-accent/10 rounded-full"
                  >
                    <Zap className="w-4 h-4" />
                    {combo}x Combo!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mb-4">
            Use ← → arrow keys to move between lanes
          </p>

          {/* Game Canvas */}
          <div className="relative w-full h-96 bg-gradient-to-b from-muted/20 to-muted/40 rounded-xl overflow-hidden border-2 border-border">
            {/* Road lanes */}
            <div className="absolute inset-0 flex">
              {lanes.map((lane) => (
                <div
                  key={lane}
                  className="flex-1 border-r last:border-r-0 border-dashed border-border/30"
                />
              ))}
            </div>

            {/* Game Objects */}
            {gameObjects.map((obj) => (
              <motion.div
                key={obj.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute text-2xl transition-all ${
                  obj.type === 'bonus' ? 'animate-pulse scale-125' : ''
                }`}
                style={{
                  left: `${obj.lane}%`,
                  top: `${obj.position}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {obj.icon}
              </motion.div>
            ))}

            {/* Player Truck */}
            <motion.div
              className="absolute text-4xl"
              animate={{
                left: `${truckPosition}%`,
              }}
              transition={{ duration: 0.2 }}
              style={{
                top: '85%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              🚛
            </motion.div>

            {/* Game Over / Win Overlay */}
            <AnimatePresence>
              {(gameOver || won) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center"
                >
                  {won ? (
                    <>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                      >
                        <Trophy className="w-16 h-16 text-accent mb-4" />
                      </motion.div>
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
                      <p className="text-lg mb-4">Score: {score}/{winningScore}</p>
                    </>
                  )}
                  <Button onClick={restartGame} className="btn-accent">
                    Try Again
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
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
