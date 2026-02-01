# Touch Target Sizing Verification Checklist

## Purpose
This checklist provides a manual verification process for touch target sizing across the website. Use browser developer tools to verify that all interactive elements meet the 44x44px minimum requirement.

## How to Verify Touch Target Sizes

### Using Browser Developer Tools

1. **Open Developer Tools** (F12 or Right-click → Inspect)
2. **Select an interactive element** (button, link, etc.)
3. **Check the Computed tab** in the Styles panel
4. **Verify dimensions**:
   - Check `height` or calculate: `padding-top` + `line-height` + `padding-bottom` ≥ 44px
   - Check `width` or calculate: `padding-left` + content + `padding-right` ≥ 44px

### Using Accessibility Tools

- **Chrome Lighthouse**: Run accessibility audit, check for touch target sizing issues
- **axe DevTools**: Install extension, run scan, review touch target warnings
- **WAVE**: Use WAVE extension to identify interactive elements

## Verification Checklist

### Header Navigation

- [ ] **Logo Link**: Adequate clickable area (image + text)
- [ ] **"Learn" Link**: Min-height 44px with padding
- [ ] **"Pre-Qualify" Link**: Min-height 44px with padding
- [ ] **"Calculator" Link**: Min-height 44px with padding
- [ ] **"Loan Options" Link**: Min-height 44px with padding
- [ ] **"About Us" Link**: Min-height 44px with padding
- [ ] **"Blog" Link**: Min-height 44px with padding
- [ ] **"Contact" Link**: Min-height 44px with padding
- [ ] **"Apply Online" CTA Button**: Min-height 44px, adequate padding
- [ ] **Mobile Menu Toggle**: 44x44px minimum

### Footer Navigation

- [ ] **About Us Section Links**: Min-height 44px each
- [ ] **Loan Options Section Links**: Min-height 44px each
- [ ] **Resources Section Links**: Min-height 44px each
- [ ] **Connect Section Links**: Min-height 44px each
- [ ] **Social Media Icons**: 44x44px each (Facebook, LinkedIn, etc.)
- [ ] **Legal Links** (Privacy Policy, ADA Statement): Min-height 44px each

### Buttons

- [ ] **Primary Buttons** (`.btn-primary`): Min-height 44px, min-width 44px
- [ ] **Secondary Buttons** (`.btn-secondary`): Min-height 44px, min-width 44px
- [ ] **CTA Buttons**: Min-height 44px throughout site
- [ ] **Form Submit Buttons**: Min-height 44px
- [ ] **Calculator Action Buttons**: Min-height 44px

### Cards

- [ ] **Blog Cards**: Entire card is clickable with adequate size
- [ ] **Loan Option Cards**: Entire card is clickable with adequate size
- [ ] **Team Member Cards**: Entire card is clickable with adequate size
- [ ] **Calculator Cards**: Entire card is clickable with adequate size

### Form Elements

- [ ] **Text Inputs**: Min-height 44px with padding
- [ ] **Email Inputs**: Min-height 44px with padding
- [ ] **Number Inputs**: Min-height 44px with padding
- [ ] **Select Dropdowns**: Min-height 44px with padding
- [ ] **Checkboxes**: Label provides 44x44px touch area
- [ ] **Radio Buttons**: Label provides 44x44px touch area

### Breadcrumb Navigation

- [ ] **Home Link**: Min-height 44px with padding
- [ ] **Intermediate Links**: Min-height 44px with padding
- [ ] **Current Page Indicator**: Adequate spacing

### Mobile-Specific Elements

- [ ] **Mobile Navigation Menu Items**: Full-width with min-height 44px
- [ ] **Mobile Toggle Button**: 44x44px minimum
- [ ] **Mobile CTA Buttons**: Min-height 44px
- [ ] **Mobile Form Inputs**: Min-height 44px

### Page-Specific Elements

#### Calculator Pages
- [ ] **Input Field Labels**: Clickable with adequate area
- [ ] **Calculate Button**: Min-height 44px
- [ ] **Reset Button**: Min-height 44px
- [ ] **Related Calculator Links**: Min-height 44px

#### Blog Pages
- [ ] **Blog Post Links**: Entire card clickable
- [ ] **Category Tags**: Min-height 44px if clickable
- [ ] **Read More Links**: Min-height 44px
- [ ] **Pagination Links**: Min-height 44px each

#### Loan Options Pages
- [ ] **Loan Option Cards**: Entire card clickable
- [ ] **Related Calculator Links**: Min-height 44px
- [ ] **Schedule Call CTA**: Min-height 44px

#### Team Pages
- [ ] **Team Member Cards**: Entire card clickable
- [ ] **Contact Links**: Min-height 44px
- [ ] **Calendly Links**: Min-height 44px

## Common Issues and Solutions

### Issue: Link text is small but touch area is adequate
**Solution**: ✅ Correct - padding provides the touch area, text size is for readability

### Issue: Icon button appears small visually
**Solution**: Check if `min-width` and `min-height` are set to 44px - visual size can be smaller if padding provides touch area

### Issue: Inline links in paragraphs
**Solution**: Ensure vertical padding of at least 12px to provide 44px height with line-height

### Issue: Card components
**Solution**: Entire card should be wrapped in a link/button with `min-height: 44px`

## Testing on Real Devices

### Mobile Phones (Recommended)
- [ ] iPhone SE (small screen)
- [ ] iPhone 12/13/14 (standard size)
- [ ] Samsung Galaxy S21 (Android)
- [ ] Google Pixel (Android)

### Tablets
- [ ] iPad (standard)
- [ ] iPad Pro (large)
- [ ] Android tablet

### Testing Procedure
1. Navigate to each major page
2. Attempt to tap all interactive elements
3. Note any elements that are difficult to tap
4. Verify no accidental taps on adjacent elements

## Automated Testing

### Lighthouse Audit
```bash
# Run Lighthouse in Chrome DevTools
# Or use CLI:
lighthouse https://your-site.com --only-categories=accessibility --view
```

### axe DevTools
1. Install axe DevTools extension
2. Open DevTools → axe DevTools tab
3. Click "Scan ALL of my page"
4. Review "Touch target" issues

## Sign-Off

- [ ] All header navigation elements verified
- [ ] All footer navigation elements verified
- [ ] All button elements verified
- [ ] All card components verified
- [ ] All form elements verified
- [ ] All breadcrumb elements verified
- [ ] Mobile-specific elements verified
- [ ] Page-specific elements verified
- [ ] Tested on real mobile devices
- [ ] Automated accessibility audit passed

**Verified By**: _________________  
**Date**: _________________  
**Notes**: _________________

## Reference

- **WCAG 2.1 Success Criterion 2.5.5**: Target Size (Level AAA requires 44x44px)
- **WCAG 2.1 Level AA**: Recommended minimum of 44x44px for touch targets
- **Apple Human Interface Guidelines**: Minimum 44x44 points
- **Android Material Design**: Minimum 48x48 dp (approximately 44x44px)
