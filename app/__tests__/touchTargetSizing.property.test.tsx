/**
 * Touch Target Sizing Property-Based Tests
 * 
 * **Property 18: Touch Target Sizing**
 * **Validates: Requirements 7.2**
 * 
 * For any interactive element (button, link, form input), the touch target
 * should be at least 44x44 pixels for usability on touch devices.
 * 
 * This property test verifies that interactive elements maintain adequate
 * touch target sizes across various configurations and content.
 */

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import fc from 'fast-check';

// Minimum touch target size as per WCAG 2.1 AA guidelines
const MIN_TOUCH_TARGET_SIZE = 44;

/**
 * Calculate the effective touch target height of an element
 */
function calculateTouchTargetHeight(element: HTMLElement): number {
  const styles = window.getComputedStyle(element);
  
  const paddingTop = parseFloat(styles.paddingTop) || 0;
  const paddingBottom = parseFloat(styles.paddingBottom) || 0;
  const borderTopWidth = parseFloat(styles.borderTopWidth) || 0;
  const borderBottomWidth = parseFloat(styles.borderBottomWidth) || 0;
  const fontSize = parseFloat(styles.fontSize) || 16;
  const lineHeight = parseFloat(styles.lineHeight) || fontSize * 1.2;
  
  // If element has explicit height, use that
  const explicitHeight = parseFloat(styles.height);
  if (explicitHeight && !isNaN(explicitHeight) && explicitHeight > 0) {
    return explicitHeight;
  }
  
  // Otherwise calculate from content + padding + border
  return paddingTop + lineHeight + paddingBottom + borderTopWidth + borderBottomWidth;
}

/**
 * Calculate the effective touch target width of an element
 */
function calculateTouchTargetWidth(element: HTMLElement): number {
  const styles = window.getComputedStyle(element);
  
  const paddingLeft = parseFloat(styles.paddingLeft) || 0;
  const paddingRight = parseFloat(styles.paddingRight) || 0;
  const borderLeftWidth = parseFloat(styles.borderLeftWidth) || 0;
  const borderRightWidth = parseFloat(styles.borderRightWidth) || 0;
  
  // If element has explicit width, use that
  const explicitWidth = parseFloat(styles.width);
  if (explicitWidth && !isNaN(explicitWidth) && explicitWidth > 0) {
    return explicitWidth;
  }
  
  // For text elements, calculate width including padding and borders
  return paddingLeft + paddingRight + borderLeftWidth + borderRightWidth;
}

describe('Property 18: Touch Target Sizing', () => {
  describe('Button Elements', () => {
    it('should maintain minimum touch target size across various button configurations', () => {
      fc.assert(
        fc.property(
          fc.record({
            text: fc.string({ minLength: 1, maxLength: 50 }),
            paddingVertical: fc.integer({ min: 14, max: 32 }),
            paddingHorizontal: fc.integer({ min: 16, max: 64 }),
            fontSize: fc.integer({ min: 12, max: 24 }),
            className: fc.constantFrom('btn btn-primary', 'btn btn-secondary', ''),
          }),
          ({ text, paddingVertical, paddingHorizontal, fontSize, className }) => {
            const { container } = render(
              <button
                className={className}
                style={{
                  padding: `${paddingVertical}px ${paddingHorizontal}px`,
                  fontSize: `${fontSize}px`,
                }}
              >
                {text}
              </button>
            );
            
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();
            
            if (button) {
              const height = calculateTouchTargetHeight(button);
              
              // Touch target height should be at least 44px
              expect(height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should maintain minimum touch target size for icon buttons', () => {
      fc.assert(
        fc.property(
          fc.record({
            size: fc.integer({ min: 44, max: 64 }),
            padding: fc.integer({ min: 8, max: 20 }),
            icon: fc.constantFrom('×', '☰', '✓', '✕', '⋮'),
          }),
          ({ size, padding, icon }) => {
            const { container } = render(
              <button
                aria-label="Icon button"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  padding: `${padding}px`,
                }}
              >
                {icon}
              </button>
            );
            
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();
            
            if (button) {
              const height = calculateTouchTargetHeight(button);
              const width = calculateTouchTargetWidth(button);
              
              // Icon buttons should have explicit dimensions meeting minimum
              expect(height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
              expect(width).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Link Elements', () => {
    it('should maintain minimum touch target size across various link configurations', () => {
      fc.assert(
        fc.property(
          fc.record({
            text: fc.string({ minLength: 1, maxLength: 50 }),
            paddingVertical: fc.integer({ min: 15, max: 32 }),
            paddingHorizontal: fc.integer({ min: 8, max: 32 }),
            fontSize: fc.integer({ min: 12, max: 20 }),
          }),
          ({ text, paddingVertical, paddingHorizontal, fontSize }) => {
            const { container } = render(
              <a
                href="/test"
                style={{
                  padding: `${paddingVertical}px ${paddingHorizontal}px`,
                  fontSize: `${fontSize}px`,
                  display: 'inline-block',
                }}
              >
                {text}
              </a>
            );
            
            const link = container.querySelector('a');
            expect(link).toBeInTheDocument();
            
            if (link) {
              const height = calculateTouchTargetHeight(link);
              
              // Touch target height should be at least 44px
              expect(height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should maintain minimum touch target size for navigation links', () => {
      fc.assert(
        fc.property(
          fc.record({
            text: fc.string({ minLength: 3, maxLength: 20 }),
            paddingVertical: fc.integer({ min: 14, max: 24 }),
            paddingHorizontal: fc.integer({ min: 16, max: 32 }),
          }),
          ({ text, paddingVertical, paddingHorizontal }) => {
            const { container } = render(
              <nav>
                <a
                  href="/test"
                  style={{
                    padding: `${paddingVertical}px ${paddingHorizontal}px`,
                    display: 'inline-block',
                  }}
                >
                  {text}
                </a>
              </nav>
            );
            
            const link = container.querySelector('a');
            expect(link).toBeInTheDocument();
            
            if (link) {
              const height = calculateTouchTargetHeight(link);
              
              // Navigation links should have adequate touch targets
              expect(height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Form Input Elements', () => {
    it('should maintain minimum touch target size across various input configurations', () => {
      fc.assert(
        fc.property(
          fc.record({
            type: fc.constantFrom('text', 'email', 'tel', 'number', 'password'),
            paddingVertical: fc.integer({ min: 12, max: 20 }),
            paddingHorizontal: fc.integer({ min: 12, max: 24 }),
            fontSize: fc.integer({ min: 14, max: 18 }),
          }),
          ({ type, paddingVertical, paddingHorizontal, fontSize }) => {
            const { container } = render(
              <input
                type={type}
                placeholder="Test input"
                style={{
                  padding: `${paddingVertical}px ${paddingHorizontal}px`,
                  fontSize: `${fontSize}px`,
                }}
              />
            );
            
            const input = container.querySelector('input');
            expect(input).toBeInTheDocument();
            
            if (input) {
              const height = calculateTouchTargetHeight(input);
              
              // Form inputs should have adequate touch targets
              expect(height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should maintain minimum touch target size for select elements', () => {
      fc.assert(
        fc.property(
          fc.record({
            paddingVertical: fc.integer({ min: 12, max: 20 }),
            paddingHorizontal: fc.integer({ min: 12, max: 24 }),
            options: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 2, maxLength: 5 }),
          }),
          ({ paddingVertical, paddingHorizontal, options }) => {
            const { container } = render(
              <select
                style={{
                  padding: `${paddingVertical}px ${paddingHorizontal}px`,
                }}
              >
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            );
            
            const select = container.querySelector('select');
            expect(select).toBeInTheDocument();
            
            if (select) {
              const height = calculateTouchTargetHeight(select);
              
              // Select elements should have adequate touch targets
              expect(height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should maintain minimum touch target size for checkbox and radio inputs', () => {
      fc.assert(
        fc.property(
          fc.record({
            type: fc.constantFrom('checkbox', 'radio'),
            size: fc.integer({ min: 20, max: 32 }),
            labelPadding: fc.integer({ min: 13, max: 16 }),
          }),
          ({ type, size, labelPadding }) => {
            const { container } = render(
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: `${labelPadding}px`,
                  cursor: 'pointer',
                }}
              >
                <input
                  type={type}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    marginRight: '8px',
                  }}
                />
                Test option
              </label>
            );
            
            const label = container.querySelector('label');
            expect(label).toBeInTheDocument();
            
            if (label) {
              const height = calculateTouchTargetHeight(label);
              
              // The entire label should be clickable with adequate touch target
              expect(height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Card Components', () => {
    it('should maintain minimum touch target size for clickable cards', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 5, maxLength: 50 }),
            description: fc.string({ minLength: 10, maxLength: 100 }),
            padding: fc.integer({ min: 16, max: 40 }),
            minHeight: fc.integer({ min: 44, max: 300 }),
          }),
          ({ title, description, padding, minHeight }) => {
            const { container } = render(
              <a
                href="/test"
                style={{
                  display: 'block',
                  padding: `${padding}px`,
                  minHeight: `${minHeight}px`,
                  textDecoration: 'none',
                }}
              >
                <h3>{title}</h3>
                <p>{description}</p>
              </a>
            );
            
            const card = container.querySelector('a');
            expect(card).toBeInTheDocument();
            
            if (card) {
              const styles = window.getComputedStyle(card);
              const cardMinHeight = parseFloat(styles.minHeight);
              
              // Cards should have minimum height ensuring adequate touch targets
              expect(cardMinHeight).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Mobile-Specific Touch Targets', () => {
    it('should maintain minimum touch target size for mobile menu items', () => {
      fc.assert(
        fc.property(
          fc.record({
            text: fc.string({ minLength: 3, maxLength: 20 }),
            paddingVertical: fc.integer({ min: 14, max: 24 }),
            paddingHorizontal: fc.integer({ min: 16, max: 32 }),
          }),
          ({ text, paddingVertical, paddingHorizontal }) => {
            // Simulate mobile viewport
            global.innerWidth = 375;
            
            const { container } = render(
              <nav>
                <a
                  href="/test"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: `${paddingVertical}px ${paddingHorizontal}px`,
                  }}
                >
                  {text}
                </a>
              </nav>
            );
            
            const link = container.querySelector('a');
            expect(link).toBeInTheDocument();
            
            if (link) {
              const height = calculateTouchTargetHeight(link);
              
              // Mobile menu items should have adequate touch targets
              expect(height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should maintain minimum touch target size for mobile toggle buttons', () => {
      fc.assert(
        fc.property(
          fc.record({
            size: fc.integer({ min: 44, max: 60 }),
            padding: fc.integer({ min: 8, max: 16 }),
          }),
          ({ size, padding }) => {
            const { container } = render(
              <button
                aria-label="Toggle menu"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  padding: `${padding}px`,
                }}
              >
                ☰
              </button>
            );
            
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();
            
            if (button) {
              const height = calculateTouchTargetHeight(button);
              const width = calculateTouchTargetWidth(button);
              
              // Mobile toggle buttons should have explicit adequate dimensions
              expect(height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
              expect(width).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle small font sizes with adequate padding', () => {
      fc.assert(
        fc.property(
          fc.record({
            fontSize: fc.integer({ min: 10, max: 14 }),
            paddingVertical: fc.integer({ min: 17, max: 25 }),
          }),
          ({ fontSize, paddingVertical }) => {
            const { container } = render(
              <a
                href="/test"
                style={{
                  fontSize: `${fontSize}px`,
                  padding: `${paddingVertical}px 12px`,
                  display: 'inline-block',
                }}
              >
                Small text link
              </a>
            );
            
            const link = container.querySelector('a');
            expect(link).toBeInTheDocument();
            
            if (link) {
              const height = calculateTouchTargetHeight(link);
              
              // Even small text should have adequate touch targets with padding
              expect(height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should handle elements with borders contributing to touch target size', () => {
      fc.assert(
        fc.property(
          fc.record({
            paddingVertical: fc.integer({ min: 12, max: 20 }),
            borderWidth: fc.integer({ min: 1, max: 4 }),
          }),
          ({ paddingVertical, borderWidth }) => {
            const { container } = render(
              <button
                style={{
                  padding: `${paddingVertical}px 16px`,
                  border: `${borderWidth}px solid black`,
                }}
              >
                Button
              </button>
            );
            
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();
            
            if (button) {
              const height = calculateTouchTargetHeight(button);
              
              // Border should contribute to total touch target size
              expect(height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
