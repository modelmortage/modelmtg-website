/**
 * Library Verification Tests
 * 
 * This test file verifies that all required libraries for the UI redesign
 * are properly installed and can be imported without errors.
 * 
 * Requirements: 14.1, 14.2
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Library Installation Verification', () => {
  describe('React Icons', () => {
    it('should import and render icons from react-icons/fa', () => {
      const { FaHome, FaCalculator } = require('react-icons/fa');
      const { container } = render(
        <div>
          <FaHome data-testid="home-icon" />
          <FaCalculator data-testid="calculator-icon" />
        </div>
      );
      expect(container.querySelector('[data-testid="home-icon"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="calculator-icon"]')).toBeInTheDocument();
    });

    it('should import icons from react-icons/md', () => {
      const { MdEmail } = require('react-icons/md');
      const { container } = render(<MdEmail data-testid="email-icon" />);
      expect(container.querySelector('[data-testid="email-icon"]')).toBeInTheDocument();
    });
  });

  describe('Recharts', () => {
    it('should import Recharts components', () => {
      const { LineChart, BarChart, PieChart, ResponsiveContainer } = require('recharts');
      expect(LineChart).toBeDefined();
      expect(BarChart).toBeDefined();
      expect(PieChart).toBeDefined();
      expect(ResponsiveContainer).toBeDefined();
    });

    it('should render a simple LineChart', () => {
      const { LineChart, Line, XAxis, YAxis } = require('recharts');
      const data = [
        { name: 'A', value: 10 },
        { name: 'B', value: 20 },
      ];
      
      const { container } = render(
        <LineChart width={400} height={300} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      );
      
      expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();
    });
  });

  describe('Property-Based Testing Library', () => {
    it('should import @fast-check/jest', () => {
      const fc = require('@fast-check/jest');
      expect(fc).toBeDefined();
      expect(fc.it).toBeDefined();
      expect(fc.test).toBeDefined();
    });

    it('should import fast-check', () => {
      const fc = require('fast-check');
      expect(fc).toBeDefined();
      expect(fc.assert).toBeDefined();
      expect(fc.property).toBeDefined();
    });
  });

  describe('Accessibility Testing Library', () => {
    it('should import jest-axe', () => {
      const { axe, toHaveNoViolations } = require('jest-axe');
      expect(axe).toBeDefined();
      expect(toHaveNoViolations).toBeDefined();
    });

    it('should import @testing-library/jest-dom', () => {
      // Already imported at the top, just verify matchers are available
      expect(expect(document.body).toBeInTheDocument).toBeDefined();
    });

    it('should run axe accessibility check', async () => {
      const { axe, toHaveNoViolations } = require('jest-axe');
      expect.extend(toHaveNoViolations);

      const { container } = render(
        <button aria-label="Test button">Click me</button>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('React Version Compatibility', () => {
    it('should be using React 18.x', () => {
      const React = require('react');
      const version = React.version;
      expect(version).toMatch(/^18\./);
    });

    it('should verify react-icons is compatible with React 18', () => {
      const { FaCheck } = require('react-icons/fa');
      const { container } = render(<FaCheck />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should verify recharts is compatible with React 18', () => {
      const { BarChart, Bar } = require('recharts');
      const data = [{ name: 'Test', value: 100 }];
      const { container } = render(
        <BarChart width={200} height={200} data={data}>
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      );
      expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();
    });
  });
});
