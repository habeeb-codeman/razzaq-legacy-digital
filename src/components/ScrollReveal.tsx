import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
  threshold?: number;
}

const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 30,
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) => {
  const [ref, inView] = useInView({ triggerOnce: once, threshold });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      case 'none':
        return { opacity: 0 };
      default:
        return { opacity: 0, y: distance };
    }
  };

  const getFinalPosition = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 };
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 };
      case 'none':
        return { opacity: 1 };
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={inView ? getFinalPosition() : getInitialPosition()}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggeredRevealProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  once?: boolean;
  threshold?: number;
  containerClassName?: string;
}

export const StaggeredReveal = ({
  children,
  className = '',
  staggerDelay = 0.1,
  duration = 0.5,
  direction = 'up',
  distance = 30,
  once = true,
  threshold = 0.1,
  containerClassName = '',
}: StaggeredRevealProps) => {
  const [ref, inView] = useInView({ triggerOnce: once, threshold });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      default:
        return { opacity: 0, y: distance };
    }
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: getInitialPosition(),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={containerClassName}
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants} className={className}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

interface ScaleRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
}

export const ScaleReveal = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1,
}: ScaleRevealProps) => {
  const [ref, inView] = useInView({ triggerOnce: once, threshold });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface RotateRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  rotation?: number;
}

export const RotateReveal = ({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  once = true,
  threshold = 0.1,
  rotation = 5,
}: RotateRevealProps) => {
  const [ref, inView] = useInView({ triggerOnce: once, threshold });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotate: rotation, y: 20 }}
      animate={inView ? { opacity: 1, rotate: 0, y: 0 } : { opacity: 0, rotate: rotation, y: 20 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
