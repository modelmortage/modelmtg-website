'use client'

/**
 * Chart Component
 * 
 * Wrapper component for Recharts that provides consistent styling,
 * theming, and accessibility features.
 * 
 * Features:
 * - Multiple chart types (line, bar, pie, area)
 * - Theme color integration
 * - Responsive by default
 * - Accessible with hidden data table
 * - Tooltip support
 */

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  Line,
  Bar,
  Pie,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { chartColors } from '../../../app/styles/colors';
import styles from './Chart.module.css';

export interface ChartData {
  [key: string]: string | number;
}

export interface ChartProps {
  /** Chart type */
  type: 'line' | 'bar' | 'pie' | 'area';
  /** Chart data */
  data: ChartData[];
  /** X-axis data key */
  xAxisKey?: string;
  /** Y-axis data key(s) */
  yAxisKey?: string | string[];
  /** Custom colors (defaults to theme colors) */
  colors?: string[];
  /** Chart height in pixels */
  height?: number;
  /** Show legend */
  showLegend?: boolean;
  /** Show grid */
  showGrid?: boolean;
  /** Responsive (default: true) */
  responsive?: boolean;
  /** Chart title for accessibility */
  title?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * Chart component for data visualization
 * 
 * @example
 * // Line chart
 * <Chart
 *   type="line"
 *   data={data}
 *   xAxisKey="month"
 *   yAxisKey="value"
 *   title="Monthly Revenue"
 * />
 * 
 * @example
 * // Bar chart with multiple series
 * <Chart
 *   type="bar"
 *   data={data}
 *   xAxisKey="category"
 *   yAxisKey={["value1", "value2"]}
 *   showLegend
 * />
 * 
 * @example
 * // Pie chart
 * <Chart
 *   type="pie"
 *   data={data}
 *   yAxisKey="value"
 *   title="Distribution"
 * />
 */
export const Chart: React.FC<ChartProps> = ({
  type,
  data,
  xAxisKey,
  yAxisKey,
  colors = chartColors,
  height = 300,
  showLegend = false,
  showGrid = true,
  responsive = true,
  title,
  className = '',
}) => {
  const [error, setError] = React.useState<Error | null>(null);

  if (error) {
    return (
      <div className={styles['chart-error']}>
        <p>Unable to display chart</p>
        {title && <p className={styles['sr-only']}>{title}</p>}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles['chart-empty']}>
        <p>No data available</p>
        {title && <p className={styles['sr-only']}>{title}</p>}
      </div>
    );
  }

  try {
    const yAxisKeys = Array.isArray(yAxisKey) 
      ? yAxisKey.filter((key): key is string => key !== undefined)
      : yAxisKey ? [yAxisKey] : [];
    
    if (yAxisKeys.length === 0 && type !== 'pie') {
      throw new Error('yAxisKey is required for this chart type');
    }
    
    const chartContent = (() => {
      switch (type) {
        case 'line':
          return (
            <LineChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />}
              {xAxisKey && <XAxis dataKey={xAxisKey} stroke="#757575" />}
              <YAxis stroke="#757575" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px',
                }}
              />
              {showLegend && <Legend />}
              {yAxisKeys.map((key, index) => (
                <Line
                  key={key || index}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[index % colors.length] }}
                />
              ))}
            </LineChart>
          );

        case 'bar':
          return (
            <BarChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />}
              {xAxisKey && <XAxis dataKey={xAxisKey} stroke="#757575" />}
              <YAxis stroke="#757575" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px',
                }}
              />
              {showLegend && <Legend />}
              {yAxisKeys.map((key, index) => (
                <Bar
                  key={key || index}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                />
              ))}
            </BarChart>
          );

        case 'pie':
          const pieDataKey = yAxisKeys[0] || 'value';
          return (
            <PieChart>
              <Pie
                data={data}
                dataKey={pieDataKey}
                nameKey={xAxisKey}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px',
                }}
              />
              {showLegend && <Legend />}
            </PieChart>
          );

        case 'area':
          return (
            <AreaChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />}
              {xAxisKey && <XAxis dataKey={xAxisKey} stroke="#757575" />}
              <YAxis stroke="#757575" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px',
                }}
              />
              {showLegend && <Legend />}
              {yAxisKeys.map((key, index) => (
                <Area
                  key={key || index}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          );

        default:
          return null;
      }
    })();

    const containerClass = `${styles.chart} ${className}`.trim();

    return (
      <div className={containerClass} role="img" aria-label={title}>
        {responsive ? (
          <ResponsiveContainer width="100%" height={height}>
            {chartContent}
          </ResponsiveContainer>
        ) : (
          <div style={{ width: '100%', height }}>
            {chartContent}
          </div>
        )}
        
        {/* Hidden data table for accessibility */}
        {title && (
          <table className={styles['sr-only']} aria-label={`${title} data table`}>
            <caption>{title}</caption>
            <thead>
              <tr>
                {xAxisKey && <th>{xAxisKey}</th>}
                {yAxisKeys.map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {xAxisKey && <td>{row[xAxisKey]}</td>}
                  {yAxisKeys.map(key => (
                    <td key={key}>{row[key || '']}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  } catch (err) {
    setError(err as Error);
    console.error('Chart rendering error:', err);
    return (
      <div className={styles['chart-error']}>
        <p>Unable to display chart</p>
      </div>
    );
  }
};

export default Chart;
