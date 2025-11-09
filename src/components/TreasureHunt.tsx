import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Lock, Unlock, Gift, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface TreasureHuntProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ClueProgress {
  clue1: boolean; // Hidden logo click
  clue2: boolean; // Konami code
  clue3: boolean; // Gallery secret item
  clue4: boolean; // Win truck game
  clue5: boolean; // Footer secret
}

const DISCOUNT_CODE = 'RAZZAQ50YEARS';

export const TreasureHunt = ({ isOpen, onClose }: TreasureHuntProps) => {
  const [progress, setProgress] = useState<ClueProgress>({
    clue1: false,
    clue2: false,
    clue3: false,
    clue4: false,
    clue5: false,
  });
  const [showReward, setShowReward] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedProgress = localStorage.getItem('treasureHuntProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, [isOpen]);

  useEffect(() => {
    const allFound = Object.values(progress).every((v) => v);
    if (allFound && !showReward) {
      setShowReward(true);
      toast.success('🎉 Congratulations! You found the treasure!');
    }
  }, [progress, showReward]);

  const clues = [
    {
      id: 'clue1',
      title: 'The Legacy Mark',
      hint: 'Click the company logo 5 times in quick succession',
      location: 'Navigation Header',
      found: progress.clue1,
    },
    {
      id: 'clue2',
      title: 'The Classic Code',
      hint: 'Enter the legendary Konami code: ↑↑↓↓←→←→BA',
      location: 'Anywhere on the site',
      found: progress.clue2,
    },
    {
      id: 'clue3',
      title: 'The Hidden Gem',
      hint: 'Find the golden wrench hidden in the Gallery',
      location: 'Gallery Page',
      found: progress.clue3,
    },
    {
      id: 'clue4',
      title: 'The Driving Challenge',
      hint: 'Score 15 points in the secret truck game',
      location: 'Mini Game (type "truck" anywhere)',
      found: progress.clue4,
    },
    {
      id: 'clue5',
      title: 'The Foundation',
      hint: 'Triple-click on "Estd. 1976" in the footer',
      location: 'Footer',
      found: progress.clue5,
    },
  ];

  const foundCount = Object.values(progress).filter(Boolean).length;
  const totalClues = clues.length;

  const copyCode = () => {
    navigator.clipboard.writeText(DISCOUNT_CODE);
    setCopied(true);
    toast.success('Discount code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-3xl"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-foreground"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </Button>

            <div className="frosted-glass p-8 rounded-2xl max-h-[80vh] overflow-y-auto">
              {!showReward ? (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-heading font-bold mb-2">
                      🗺️ 50 Years Treasure Hunt
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Find all hidden clues to unlock a special 5% discount code!
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-accent font-bold">
                        {foundCount}/{totalClues}
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(foundCount / totalClues) * 100}%` }}
                        className="h-full bg-gradient-primary"
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Clues List */}
                  <div className="space-y-4">
                    {clues.map((clue, index) => (
                      <motion.div
                        key={clue.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          clue.found
                            ? 'bg-accent/10 border-accent'
                            : 'bg-card border-border'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`mt-1 ${clue.found ? 'text-accent' : 'text-muted-foreground'}`}>
                            {clue.found ? (
                              <Unlock className="w-6 h-6" />
                            ) : (
                              <Lock className="w-6 h-6" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-heading font-semibold text-lg mb-1">
                              {clue.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {clue.hint}
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                              <MapPin className="w-3 h-3 text-accent" />
                              <span className="text-accent">{clue.location}</span>
                            </div>
                          </div>
                          {clue.found && (
                            <div className="text-accent font-bold text-2xl">✓</div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <Gift className="w-20 h-20 text-accent mx-auto mb-6 animate-pulse" />
                  <h2 className="text-4xl font-heading font-bold mb-4">
                    🎉 Treasure Found!
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Congratulations on completing the 50 Years Treasure Hunt!
                    Here's your exclusive 5% discount code:
                  </p>

                  <div className="bg-gradient-primary p-8 rounded-2xl mb-6">
                    <div className="text-5xl font-bold text-primary-foreground mb-4 tracking-wider">
                      {DISCOUNT_CODE}
                    </div>
                    <Button
                      onClick={copyCode}
                      variant="secondary"
                      className="gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="glass-card p-4 text-sm text-muted-foreground">
                    <p className="font-semibold mb-2">How to use:</p>
                    <p>
                      Contact us via WhatsApp or phone and mention this code to receive
                      5% off your purchase. Valid on orders above ₹5,000.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TreasureHunt;
