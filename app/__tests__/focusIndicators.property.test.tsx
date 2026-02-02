/**
 * Property-Based Test: Focus Indicators
 * 
 * Feature: ui-redesign
 * Property 16: Focus Indicators
 * 
 * **Validates: Requirements 12.5**
 * 
 * For any interactive element, when focused, the element should have a visible
 * focus indicator (outline, border, or box-shadow that differs from unfocused state).
 */

import fc from 'fast-check';
import { render, fireEvent } from '@testing-library/react';
import { Button } from '@/components/design-system/Button';
import { Input } from '@/components/design-system/Input';
import { Card } from '@/components/design-system/Card';

describe('Property 16: Focus Indicators', () => {
  /**
   * Helper function to get focus-related styles
   */
  function getFocusStyles(element: HTMLElement) {
    const computedStyle = window.getComputedStyle(element);
    return {
      outline: computedStyle.outline,
      outlineWidth: computedStyle.outlineWidth,
      outlineStyle: computedStyle.outlineStyle,
      outlineColor: computedStyle.outlineColor,
      outlineOffset: computedStyle.outlineOffset,
      boxShadow: computedStyle.boxShadow,
      border: computedStyle.border,
      borderWidth: computedStyle.borderWidth,
      borderStyle: computedStyle.borderStyle,
      borderColor: computedStyle.borderColor,
    };
  }

  /**
   * Helper to check if focus styles are different from unfocused state
   */
  function hasDifferentFocusStyles(
    unfocusedStyles: ReturnType<typeof getFocusStyles>,
    focusedStyles: ReturnType<typeof getFocusStyles>
  ): boolean {
    return (
      unfocusedStyles.outline !== focusedStyles.outline ||
      unfocusedStyles.outlineWidth !== focusedStyles.outlineWidth ||
      unfocusedStyles.outlineColor !== focusedStyles.outlineColor ||
      unfocusedStyles.boxShadow !== focusedStyles.boxShadow ||
      unfocusedStyles.border !== focusedStyles.border ||
      unfocusedStyles.borderColor !== focusedStyles.borderColor
    );
  }

  /**
   * Helper to check if an element has a visible focus indicator
   */
  function hasVisibleFocusIndicator(element: HTMLElement): boolean {
    const styles = getFocusStyles(element);
    
    // Check for outline
    if (styles.outlineWidth && styles.outlineWidth !== '0px' && styles.outlineStyle !== 'none') {
      return true;
    }
    
    // Check for box-shadow
    if (styles.boxShadow && styles.boxShadow !== 'none') {
      return true;
    }
    
    // Check for border (must have width and not be transparent)
    if (styles.borderWidth && styles.borderWidth !== '0px' && 
        styles.borderStyle !== 'none' && 
        !styles.borderColor.includes('transparent')) {
      return true;
    }
    
    return false;
  }

  it('should have visible focus indicators on Button components', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'outline', 'ghost'),
        fc.constantFrom('sm', 'md', 'lg'),
        (variant, size) => {
          const { container } = render(
            <Button variant={variant as any} size={size as any}>
              Test Button
            </Button>
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            // Get unfocused styles
            const unfocusedStyles = getFocusStyles(button);
            
            // Focus the button
            button.focus();
            
            // Get focused styles
            const focusedStyles = getFocusStyles(button);
            
            // Check that focus indicator is visible
            const hasIndicator = hasVisibleFocusIndicator(button);
            expect(hasIndicator).toBe(true);
            
            // Optionally check that styles changed
            // (Some browsers may apply default focus styles)
            const stylesChanged = hasDifferentFocusStyles(unfocusedStyles, focusedStyles);
            
            // At minimum, there should be a visible indicator when focused
            expect(hasIndicator || stylesChanged).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have visible focus indicators on Input components', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.string({ minLength: 0, maxLength: 50 }),
        (label, value) => {
          const { container } = render(
            <Input
              type="text"
              label={label}
              value={value}
              onChange={() => {}}
            />
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            // Get unfocused styles
            const unfocusedStyles = getFocusStyles(input);
            
            // Focus the input
            input.focus();
            
            // Get focused styles
            const focusedStyles = getFocusStyles(input);
            
            // Check that focus indicator is visible
            const hasIndicator = hasVisibleFocusIndicator(input);
            expect(hasIndicator).toBe(true);
            
            // Check that styles changed on focus
            const stylesChanged = hasDifferentFocusStyles(unfocusedStyles, focusedStyles);
            
            // At minimum, there should be a visible indicator when focused
            expect(hasIndicator || stylesChanged).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have visible focus indicators on clickable Card components', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('elevated', 'outlined', 'flat'),
        fc.constantFrom('sm', 'md', 'lg'),
        (variant, padding) => {
          const { container } = render(
            <Card 
              variant={variant as any} 
              padding={padding as any}
              onClick={() => {}}
              hoverable
            >
              <p>Test Card Content</p>
            </Card>
          );
          
          const card = container.firstChild as HTMLElement;
          expect(card).toBeTruthy();
          
          if (card) {
            // Make the card focusable
            card.setAttribute('tabIndex', '0');
            
            // Get unfocused styles
            const unfocusedStyles = getFocusStyles(card);
            
            // Focus the card
            card.focus();
            
            // Get focused styles
            const focusedStyles = getFocusStyles(card);
            
            // Check that focus indicator is visible or styles changed
            const hasIndicator = hasVisibleFocusIndicator(card);
            const stylesChanged = hasDifferentFocusStyles(unfocusedStyles, focusedStyles);
            
            // Interactive cards should have some form of focus indication
            expect(hasIndicator || stylesChanged).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have focus indicators on all interactive elements', () => {
    const { container } = render(
      <div>
        <Button variant="primary">Button 1</Button>
        <Button variant="secondary">Button 2</Button>
        <Input type="text" label="Test Input" value="" onChange={() => {}} />
        <a href="/test">Test Link</a>
      </div>
    );

    // Get all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, input, a[href], [tabindex]:not([tabindex="-1"])'
    );

    expect(focusableElements.length).toBeGreaterThan(0);

    focusableElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      
      // Focus the element
      htmlElement.focus();
      
      // Check for visible focus indicator
      const hasIndicator = hasVisibleFocusIndicator(htmlElement);
      
      // All interactive elements should have focus indicators
      expect(hasIndicator).toBe(true);
    });
  });

  it('should maintain focus indicators across different states', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'outline', 'ghost'),
        fc.boolean(),
        (variant, disabled) => {
          const { container } = render(
            <Button variant={variant as any} disabled={disabled}>
              Test Button
            </Button>
          );
          
          const button = container.querySelector('button');
          
          if (button && !disabled) {
            // Focus the button
            button.focus();
            
            // Check for focus indicator
            const hasIndicator = hasVisibleFocusIndicator(button);
            expect(hasIndicator).toBe(true);
            
            // Simulate hover (doesn't affect focus indicator requirement)
            fireEvent.mouseEnter(button);
            
            // Focus indicator should still be present
            const hasIndicatorAfterHover = hasVisibleFocusIndicator(button);
            expect(hasIndicatorAfterHover).toBe(true);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should have focus indicators that meet minimum visibility requirements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'outline', 'ghost'),
        (variant) => {
          const { container } = render(
            <Button variant={variant as any}>Test Button</Button>
          );
          
          const button = container.querySelector('button');
          
          if (button) {
            button.focus();
            const styles = getFocusStyles(button);
            
            // Check that outline width is at least 1px if outline is used
            if (styles.outlineStyle !== 'none' && styles.outlineWidth !== '0px') {
              const outlineWidth = parseFloat(styles.outlineWidth);
              expect(outlineWidth).toBeGreaterThanOrEqual(1);
            }
            
            // Check that border width is at least 1px if border is used
            if (styles.borderStyle !== 'none' && styles.borderWidth !== '0px') {
              const borderWidth = parseFloat(styles.borderWidth);
              expect(borderWidth).toBeGreaterThanOrEqual(1);
            }
            
            // At least one focus indicator should be present
            const hasIndicator = hasVisibleFocusIndicator(button);
            expect(hasIndicator).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
