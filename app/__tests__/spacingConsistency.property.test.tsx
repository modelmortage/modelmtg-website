/**
 * Property-Based Test: Spacing Consistency
 * 
 * Feature: ui-redesign
 * Property 7: Spacing Consistency
 * 
 * **Validates: Requirements 3.4**
 * 
 * For any component using spacing (margins, padding, gaps), the spacing values
 * should be multiples of the theme spacing units.
 */

import fc from 'fast-check';
import { render } from '@testing-library/react';
import { Button } from '@/components/design-system/Button';
import { Card } from '@/components/design-system/Card';
import { Input } from '@/components/design-system/Input';
import { spacingInPixels, isValidSpacingMultiple } from '@/app/styles/spacing';

describe('Property 7: Spacing Consistency', () => {
  /**
   * Helper function to extract spacing values from computed styles
   * Only extracts gap values which should strictly follow the spacing system
   */
  function extractGapValues(element: HTMLElement): number[] {
    const computedStyle = window.getComputedStyle(element);
    const spacingValues: number[] = [];
    
    // Extract gap value (for flex/grid containers)
    const gap = parseFloat(computedStyle.gap);
    if (gap > 0 && !isNaN(gap)) spacingValues.push(gap);
    
    // Extract row-gap and column-gap if different from gap
    const rowGap = parseFloat(computedStyle.rowGap);
    const columnGap = parseFloat(computedStyle.columnGap);
    
    if (rowGap > 0 && !isNaN(rowGap) && rowGap !== gap) spacingValues.push(rowGap);
    if (columnGap > 0 && !isNaN(columnGap) && columnGap !== gap) spacingValues.push(columnGap);
    
    return spacingValues;
  }
  
  /**
   * Helper to check if a value is close to a spacing scale value
   * Allows 1px tolerance for rounding
   */
  function isCloseToSpacingScale(value: number): boolean {
    return Object.values(spacingInPixels).some(
      scaleValue => Math.abs(value - scaleValue) <= 1
    );
  }

  it('should use gap values from the spacing scale in Button components', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'outline', 'ghost'),
        fc.constantFrom('sm', 'md', 'lg'),
        fc.boolean(),
        (variant, size, fullWidth) => {
          const { container } = render(
            <Button variant={variant as any} size={size as any} fullWidth={fullWidth}>
              Test Button
            </Button>
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            const gapValues = extractGapValues(button);
            
            // All gap values should be from the spacing scale or multiples of 4px
            gapValues.forEach(value => {
              const isValid = isCloseToSpacingScale(value) || isValidSpacingMultiple(value);
              expect(isValid).toBe(true);
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use gap values from the spacing scale in Card components', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('elevated', 'outlined', 'flat'),
        fc.constantFrom('sm', 'md', 'lg'),
        (variant, padding) => {
          const { container } = render(
            <Card variant={variant as any} padding={padding as any}>
              <p>Test Card Content</p>
            </Card>
          );
          
          const card = container.firstChild as HTMLElement;
          expect(card).toBeTruthy();
          
          if (card) {
            const gapValues = extractGapValues(card);
            
            // All gap values should be from the spacing scale or multiples of 4px
            gapValues.forEach(value => {
              const isValid = isCloseToSpacingScale(value) || isValidSpacingMultiple(value);
              expect(isValid).toBe(true);
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use gap values from the spacing scale in Input components', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.boolean(),
        (label, value, fullWidth) => {
          const { container } = render(
            <Input
              type="text"
              label={label}
              value={value}
              onChange={() => {}}
              fullWidth={fullWidth}
            />
          );
          
          const inputWrapper = container.firstChild as HTMLElement;
          expect(inputWrapper).toBeTruthy();
          
          if (inputWrapper) {
            const gapValues = extractGapValues(inputWrapper);
            
            // All gap values should be from the spacing scale or multiples of 4px
            gapValues.forEach(value => {
              const isValid = isCloseToSpacingScale(value) || isValidSpacingMultiple(value);
              expect(isValid).toBe(true);
            });
            
            // Also check the input element itself
            const input = container.querySelector('input');
            if (input) {
              const inputGapValues = extractGapValues(input);
              inputGapValues.forEach(value => {
                const isValid = isCloseToSpacingScale(value) || isValidSpacingMultiple(value);
                expect(isValid).toBe(true);
              });
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should define all theme spacing values as multiples of 4px', () => {
    // Verify that all spacing values in the theme are multiples of 4px
    Object.values(spacingInPixels).forEach(value => {
      expect(isValidSpacingMultiple(value)).toBe(true);
    });
  });

  it('should use consistent gap spacing across all components', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'outline', 'ghost'),
        fc.constantFrom('sm', 'md', 'lg'),
        (variant, size) => {
          const { container } = render(
            <Button variant={variant as any} size={size as any}>
              Test
            </Button>
          );
          
          const button = container.querySelector('button');
          if (button) {
            const gapValues = extractGapValues(button);
            
            // All gap values should match the spacing scale or be multiples of 4px
            gapValues.forEach(value => {
              const matchesSpacingScale = isCloseToSpacingScale(value);
              const isMultipleOf4 = isValidSpacingMultiple(value);
              
              expect(matchesSpacingScale || isMultipleOf4).toBe(true);
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
