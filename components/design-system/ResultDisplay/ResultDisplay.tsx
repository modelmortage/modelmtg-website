'use client'

/**
 * ResultDisplay Component
 * 
 * Specialized component for displaying calculator results with charts.
 * 
 * Features:
 * - Key metrics display in card format
 * - Chart visualization
 * - Currency and percentage formatting
 * - Number count-up animation
 */

import React, { useEffect, useState } from 'react';
import { Card } from '../Card';
import { Chart, ChartData } from '../Chart';
import styles from './ResultDisplay.module.css';

export interface CalculatorResult {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  format?: 'currency' | 'percentage' | 'number';
}

export interface ResultSummary {
  monthlyPayment?: number;
  totalInterest?: number;
  totalPrincipal?: number;
  [key: string]: any;
}

export interface ResultDisplayProps {
  /** Results section title */
  title: string;
  /** Key metrics to display */
  results: CalculatorResult[];
  /** Chart type */
  chartType: 'line' | 'bar' | 'pie' | 'area';
  /** Chart data */
  chartData: ChartData[];
  /** Chart configuration */
  chartConfig?: {
    xAxisKey?: string;
    yAxisKey?: string | string[];
    showLegend?: boolean;
    showGrid?: boolean;
    title?: string;
    valueFormatter?: (value: number) => string;
  };
  /** Summary data (optional) */
  summary?: ResultSummary;
  /** Additional CSS class */
  className?: string;
}

/**
 * Format a number as currency
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as percentage
 */
function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Format a number with commas
 */
function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Animate number counting up
 */
function useCountUp(end: number, duration: number = 1000): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return count;
}

/**
 * ResultDisplay component for calculator results
 * 
 * @example
 * <ResultDisplay
 *   title="Your Monthly Payment"
 *   results={[
 *     { label: "Principal & Interest", value: 1500, format: "currency" },
 *     { label: "Property Tax", value: 300, format: "currency" },
 *   ]}
 *   chartType="bar"
 *   chartData={chartData}
 *   chartConfig={{ xAxisKey: "category", yAxisKey: "amount" }}
 * />
 */
export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  title,
  results,
  chartType,
  chartData,
  chartConfig = {},
  summary,
  className = '',
}) => {
  const containerClass = `${styles.container} ${className}`.trim();

  return (
    <div className={containerClass}>
      <h2 className={styles.title}>{title}</h2>

      {/* Key Metrics */}
      <div className={styles.metrics}>
        {results.map((result, index) => {
          const numericValue = typeof result.value === 'number' ? result.value : parseFloat(result.value);
          const animatedValue = useCountUp(numericValue, 800);

          let displayValue: string;
          if (result.format === 'currency') {
            displayValue = formatCurrency(animatedValue);
          } else if (result.format === 'percentage') {
            displayValue = formatPercentage(animatedValue);
          } else if (result.format === 'number') {
            displayValue = formatNumber(animatedValue);
          } else {
            displayValue = result.value.toString();
          }

          return (
            <Card key={index} variant="elevated" padding="md" className={styles.metric}>
              {result.icon && (
                <div className={styles['metric-icon']} aria-hidden="true">
                  {result.icon}
                </div>
              )}
              <div className={styles['metric-content']}>
                <div className={styles['metric-label']}>{result.label}</div>
                <div className={styles['metric-value']}>{displayValue}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Chart Visualization */}
      {chartData && chartData.length > 0 && (
        <Card variant="elevated" padding="lg" className={styles['chart-container']}>
          <Chart
            type={chartType}
            data={chartData}
            xAxisKey={chartConfig.xAxisKey}
            yAxisKey={chartConfig.yAxisKey}
            showLegend={chartConfig.showLegend}
            showGrid={chartConfig.showGrid}
            title={chartConfig.title}
            valueFormatter={chartConfig.valueFormatter}
            height={400}
          />
        </Card>
      )}

      {/* Summary Section (optional) */}
      {summary && (
        <Card variant="outlined" padding="md" className={styles.summary}>
          <h3 className={styles['summary-title']}>Summary</h3>
          <div className={styles['summary-content']}>
            {Object.entries(summary).map(([key, value]) => (
              <div key={key} className={styles['summary-item']}>
                <span className={styles['summary-label']}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                </span>
                <span className={styles['summary-value']}>
                  {typeof value === 'number' ? formatCurrency(value) : value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ResultDisplay;
