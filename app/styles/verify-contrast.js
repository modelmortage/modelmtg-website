/**
 * Contrast Verification Script
 * 
 * Verifies that all color combinations in the theme meet WCAG AA standards.
 */

const colors = {
  primary: {
    gold: '#8B6F14',      // Darker gold for text (meets WCAG AA)
    goldLight: '#D4AF37', // Original gold for backgrounds
    goldDark: '#6B5410',  // Darkest for emphasis
  },
  neutral: {
    charcoal: '#36454F',
    charcoalLight: '#4A5A65',
    charcoalDark: '#2A3439',
    gray100: '#F7F7F7',
    gray200: '#E5E5E5',
    gray300: '#D1D1D1',
    gray400: '#757575',
    gray500: '#6B6B6B',
    white: '#FFFFFF',
  },
  semantic: {
    success: '#0D9668',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',
  },
};

function getRelativeLuminance(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

function getContrastRatio(color1, color2) {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

function meetsWCAGAA(textColor, backgroundColor, isLargeText = false) {
  const ratio = getContrastRatio(textColor, backgroundColor);
  const required = isLargeText ? 3.0 : 4.5;
  
  return {
    passes: ratio >= required,
    ratio: Math.round(ratio * 100) / 100,
    required,
  };
}

const tests = [
  {
    name: 'Gold on White',
    textColor: colors.primary.gold,
    backgroundColor: colors.neutral.white,
    isLargeText: false,
  },
  {
    name: 'Charcoal on White',
    textColor: colors.neutral.charcoal,
    backgroundColor: colors.neutral.white,
    isLargeText: false,
  },
  {
    name: 'White on Charcoal',
    textColor: colors.neutral.white,
    backgroundColor: colors.neutral.charcoal,
    isLargeText: false,
  },
  {
    name: 'White on Gold',
    textColor: colors.neutral.white,
    backgroundColor: colors.primary.gold,
    isLargeText: false,
  },
  {
    name: 'Charcoal on Gold Light',
    textColor: colors.neutral.charcoal,
    backgroundColor: colors.primary.goldLight,
    isLargeText: false,
  },
  {
    name: 'Success on White (Large Text)',
    textColor: colors.semantic.success,
    backgroundColor: colors.neutral.white,
    isLargeText: true,
  },
  {
    name: 'Warning on White (Large Text)',
    textColor: colors.semantic.warning,
    backgroundColor: colors.neutral.white,
    isLargeText: true,
  },
  {
    name: 'Error on White',
    textColor: colors.semantic.error,
    backgroundColor: colors.neutral.white,
    isLargeText: false,
  },
  {
    name: 'Info on White',
    textColor: colors.semantic.info,
    backgroundColor: colors.neutral.white,
    isLargeText: false,
  },
  {
    name: 'Gray500 on White',
    textColor: colors.neutral.gray500,
    backgroundColor: colors.neutral.white,
    isLargeText: false,
  },
  {
    name: 'Gray400 on White (Large Text)',
    textColor: colors.neutral.gray400,
    backgroundColor: colors.neutral.white,
    isLargeText: true,
  },
  {
    name: 'Charcoal Light on White',
    textColor: colors.neutral.charcoalLight,
    backgroundColor: colors.neutral.white,
    isLargeText: false,
  },
  {
    name: 'Charcoal Dark on White',
    textColor: colors.neutral.charcoalDark,
    backgroundColor: colors.neutral.white,
    isLargeText: false,
  },
];

console.log('='.repeat(80));
console.log('WCAG AA Contrast Verification');
console.log('='.repeat(80));
console.log('');

let allPassed = true;

tests.forEach((test) => {
  const result = meetsWCAGAA(test.textColor, test.backgroundColor, test.isLargeText);
  
  const status = result.passes ? '✓ PASS' : '✗ FAIL';
  const textType = test.isLargeText ? 'Large Text' : 'Normal Text';
  
  console.log(`${status} ${test.name}`);
  console.log(`  Text: ${test.textColor}`);
  console.log(`  Background: ${test.backgroundColor}`);
  console.log(`  Type: ${textType}`);
  console.log(`  Ratio: ${result.ratio}:1 (Required: ${result.required}:1)`);
  console.log('');
  
  if (!result.passes) {
    allPassed = false;
  }
});

console.log('='.repeat(80));
if (allPassed) {
  console.log('✓ All color combinations meet WCAG AA standards!');
} else {
  console.log('✗ Some color combinations do not meet WCAG AA standards.');
  console.log('  Please review and adjust the color palette.');
}
console.log('='.repeat(80));
