/**
 * Design System Components
 * 
 * Centralized export for all design system components.
 * Import components from this file for consistency.
 * 
 * @example
 * import { Button, Card, Input, Icon, Chart, ResultDisplay } from '@/components/design-system';
 */

// Core Components
export { Icon } from './Icon';
export type { IconProps } from './Icon';

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card } from './Card';
export type { CardProps } from './Card';

export { Input } from './Input';
export type { InputProps } from './Input';

// Data Visualization
export { Chart } from './Chart';
export type { ChartProps, ChartData } from './Chart';

// Feature Components
export { ResultDisplay } from './ResultDisplay';
export type { ResultDisplayProps, CalculatorResult, ResultSummary } from './ResultDisplay';
