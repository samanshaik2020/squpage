// Button animation and transition utilities for Squpage templates

export interface ButtonAnimationConfig {
  type: 'none' | 'pulse' | 'bounce' | 'shake' | 'glow' | 'slide' | 'scale' | 'rotate' | 'flip'
  duration: number // in milliseconds
  timing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  trigger: 'hover' | 'click' | 'load' | 'scroll'
  infinite: boolean
  delay: number // in milliseconds
}

export interface ButtonTransitionConfig {
  property: 'all' | 'background' | 'transform' | 'color' | 'border' | 'shadow'
  duration: number // in milliseconds
  timing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  delay: number // in milliseconds
}

// Default animation configurations
export const defaultAnimations: Record<string, ButtonAnimationConfig> = {
  none: {
    type: 'none',
    duration: 0,
    timing: 'ease',
    trigger: 'hover',
    infinite: false,
    delay: 0
  },
  pulse: {
    type: 'pulse',
    duration: 1000,
    timing: 'ease-in-out',
    trigger: 'hover',
    infinite: false,
    delay: 0
  },
  bounce: {
    type: 'bounce',
    duration: 600,
    timing: 'ease-out',
    trigger: 'hover',
    infinite: false,
    delay: 0
  },
  shake: {
    type: 'shake',
    duration: 500,
    timing: 'ease-in-out',
    trigger: 'hover',
    infinite: false,
    delay: 0
  },
  glow: {
    type: 'glow',
    duration: 800,
    timing: 'ease-in-out',
    trigger: 'hover',
    infinite: false,
    delay: 0
  },
  slide: {
    type: 'slide',
    duration: 300,
    timing: 'ease-out',
    trigger: 'hover',
    infinite: false,
    delay: 0
  },
  scale: {
    type: 'scale',
    duration: 200,
    timing: 'ease-out',
    trigger: 'hover',
    infinite: false,
    delay: 0
  },
  rotate: {
    type: 'rotate',
    duration: 400,
    timing: 'ease-in-out',
    trigger: 'hover',
    infinite: false,
    delay: 0
  },
  flip: {
    type: 'flip',
    duration: 600,
    timing: 'ease-in-out',
    trigger: 'hover',
    infinite: false,
    delay: 0
  }
}

// Default transition configurations
export const defaultTransitions: Record<string, ButtonTransitionConfig> = {
  all: {
    property: 'all',
    duration: 300,
    timing: 'ease',
    delay: 0
  },
  background: {
    property: 'background',
    duration: 300,
    timing: 'ease',
    delay: 0
  },
  transform: {
    property: 'transform',
    duration: 200,
    timing: 'ease-out',
    delay: 0
  },
  color: {
    property: 'color',
    duration: 200,
    timing: 'ease',
    delay: 0
  },
  border: {
    property: 'border',
    duration: 200,
    timing: 'ease',
    delay: 0
  },
  shadow: {
    property: 'shadow',
    duration: 300,
    timing: 'ease-out',
    delay: 0
  }
}

// Generate CSS classes for animations
export const getAnimationClasses = (animation?: ButtonAnimationConfig): string => {
  if (!animation || animation.type === 'none') return ''
  
  const baseClass = `animate-${animation.type}`
  const durationClass = `duration-${animation.duration}`
  const timingClass = `timing-${animation.timing}`
  const triggerClass = `trigger-${animation.trigger}`
  const infiniteClass = animation.infinite ? 'animate-infinite' : ''
  const delayClass = animation.delay > 0 ? `delay-${animation.delay}` : ''
  
  return [baseClass, durationClass, timingClass, triggerClass, infiniteClass, delayClass]
    .filter(Boolean)
    .join(' ')
}

// Generate CSS styles for transitions
export const getTransitionStyles = (transition?: ButtonTransitionConfig): React.CSSProperties => {
  if (!transition) return {}
  
  const property = transition.property === 'shadow' ? 'box-shadow' : transition.property
  
  return {
    transition: `${property} ${transition.duration}ms ${transition.timing} ${transition.delay}ms`
  }
}

// Generate inline CSS for animations (for better browser compatibility)
export const getAnimationStyles = (animation?: ButtonAnimationConfig): React.CSSProperties => {
  if (!animation || animation.type === 'none') return {}
  
  const baseStyles: React.CSSProperties = {
    animationDuration: `${animation.duration}ms`,
    animationTimingFunction: animation.timing,
    animationDelay: `${animation.delay}ms`,
    animationIterationCount: animation.infinite ? 'infinite' : '1',
    animationFillMode: 'both'
  }
  
  // Define keyframe animations
  switch (animation.type) {
    case 'pulse':
      return {
        ...baseStyles,
        animationName: 'pulse'
      } as React.CSSProperties
    case 'bounce':
      return {
        ...baseStyles,
        animationName: 'bounce'
      }
    case 'shake':
      return {
        ...baseStyles,
        animationName: 'shake'
      }
    case 'glow':
      return {
        ...baseStyles,
        animationName: 'glow'
      }
    case 'slide':
      return {
        ...baseStyles,
        animationName: 'slideIn'
      }
    case 'scale':
      return {
        ...baseStyles,
        animationName: 'scale'
      }
    case 'rotate':
      return {
        ...baseStyles,
        animationName: 'rotate'
      }
    case 'flip':
      return {
        ...baseStyles,
        animationName: 'flip'
      }
    default:
      return baseStyles
  }
}

// CSS keyframes for custom animations (to be added to global CSS)
export const animationKeyframes = `
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0,-30px,0); }
  70% { transform: translate3d(0,-15px,0); }
  90% { transform: translate3d(0,-4px,0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

@keyframes glow {
  0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); }
  100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
}

@keyframes slideIn {
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes scale {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes flip {
  0% { transform: perspective(400px) rotateY(0); }
  40% { transform: perspective(400px) rotateY(-180deg); }
  100% { transform: perspective(400px) rotateY(0); }
}

/* Hover-triggered animations */
.animate-hover-pulse:hover {
  animation: pulse 1s ease-in-out;
}

.animate-hover-bounce:hover {
  animation: bounce 0.6s ease-out;
}

.animate-hover-shake:hover {
  animation: shake 0.5s ease-in-out;
}

.animate-hover-glow:hover {
  animation: glow 0.8s ease-in-out;
}

.animate-hover-slide:hover {
  animation: slideIn 0.3s ease-out;
}

.animate-hover-scale:hover {
  animation: scale 0.2s ease-out;
}

.animate-hover-rotate:hover {
  animation: rotate 0.4s ease-in-out;
}

.animate-hover-flip:hover {
  animation: flip 0.6s ease-in-out;
}

/* Click-triggered animations */
.animate-click-pulse:active {
  animation: pulse 0.3s ease-in-out;
}

.animate-click-bounce:active {
  animation: bounce 0.4s ease-out;
}

.animate-click-shake:active {
  animation: shake 0.3s ease-in-out;
}

.animate-click-scale:active {
  animation: scale 0.15s ease-out;
}

/* Load animations */
.animate-load-pulse {
  animation: pulse 1s ease-in-out infinite;
}

.animate-load-bounce {
  animation: bounce 1s ease-out infinite;
}

.animate-load-glow {
  animation: glow 2s ease-in-out infinite;
}

.animate-load-scale {
  animation: scale 1s ease-in-out infinite;
}
`

// Helper function to get the appropriate CSS class based on trigger
export const getAnimationClass = (animation?: ButtonAnimationConfig): string => {
  if (!animation || animation.type === 'none') return ''
  
  const { type, trigger, infinite } = animation
  
  if (trigger === 'hover') {
    return `animate-hover-${type}`
  } else if (trigger === 'click') {
    return `animate-click-${type}`
  } else if (trigger === 'load') {
    return `animate-load-${type}${infinite ? '' : ''}`
  }
  
  return `animate-${type}`
}

// Preset animation combinations for quick selection
export const animationPresets = {
  subtle: {
    animation: defaultAnimations.scale,
    transition: defaultTransitions.all
  },
  energetic: {
    animation: defaultAnimations.bounce,
    transition: defaultTransitions.transform
  },
  elegant: {
    animation: defaultAnimations.glow,
    transition: defaultTransitions.shadow
  },
  playful: {
    animation: defaultAnimations.shake,
    transition: defaultTransitions.all
  },
  modern: {
    animation: defaultAnimations.slide,
    transition: defaultTransitions.transform
  },
  classic: {
    animation: defaultAnimations.pulse,
    transition: defaultTransitions.background
  }
}
