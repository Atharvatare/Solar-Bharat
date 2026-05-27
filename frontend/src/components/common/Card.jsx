import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

const paddingMap = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className,
  hover = false,
  gradient = false,
  padding = 'md',
  as = 'div',
  onClick,
  ...rest
}) {
  const Component = hover || onClick ? motion.div : as;

  const motionProps = hover || onClick
    ? {
        whileHover: {
          y: -4,
          boxShadow: '0 0 24px rgba(245,158,11,0.18), 0 8px 32px rgba(0,0,0,0.10)',
        },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={cn(
        'glass',
        paddingMap[padding],
        gradient && 'gradient-border',
        hover && 'cursor-pointer',
        onClick && 'cursor-pointer',
        className,
      )}
      {...motionProps}
      {...rest}
    >
      {children}
    </Component>
  );
}
