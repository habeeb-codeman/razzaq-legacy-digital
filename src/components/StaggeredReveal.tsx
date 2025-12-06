import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode, Children } from 'react';

interface StaggeredRevealProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  once?: boolean;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  up: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
};

const StaggeredReveal = ({
  children,
  className = '',
  staggerDelay = 0.1,
  direction = 'up',
  once = true,
}: StaggeredRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        ...containerVariants,
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {Children.map(children, (child) => (
        <motion.div
          variants={itemVariants[direction]}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaggeredReveal;
