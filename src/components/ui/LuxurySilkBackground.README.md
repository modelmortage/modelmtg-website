# Luxury 3D Architectural Background Component

A premium black-on-black 3D geometric background inspired by luxury architectural installations and engineered panel systems. Creates depth through layered geometric planes with subtle dimensional movement.

## Design Philosophy

This is NOT a decorative effect overlay. It's a custom sculptural composition designed to feel like:
- Luxury automotive reveal campaigns
- Premium architectural installations  
- High-end real estate presentations
- Fashion house microsites
- Private banking brand sites

## Visual Style

**Material:** Matte black metal, dark graphite, architectural panels  
**Composition:** Asymmetrical layered geometric planes with strong perspective  
**Lighting:** Soft charcoal/graphite highlights that reveal form (no glow)  
**Motion:** Micro depth shifts - near layers move 1-2px, far layers move less

## Usage

```tsx
import { LuxurySilkBackground } from '@/src/components/ui/LuxurySilkBackground'

<section style={{ position: 'relative' }}>
  <LuxurySilkBackground 
    intensity="subtle" 
    speed="slow" 
    enableParallax={false} 
  />
  <div style={{ position: 'relative', zIndex: 10 }}>
    {/* Your content here */}
  </div>
</section>
```

## Props

### `intensity` (optional)
Controls the opacity and visibility of the geometric layers.

- `'subtle'` (default) - Understated, 50-70% layer opacity
- `'medium'` - Moderate visibility, 65-85%
- `'strong'` - More pronounced, 80-100%

**Recommendation:** Use `'subtle'` for most sections.

### `speed` (optional)
Controls animation duration for depth movement.

- `'slow'` (default) - 36-50s animations, barely perceptible
- `'medium'` - 26-38s animations
- `'fast'` - 16-28s animations

**Recommendation:** Use `'slow'` for premium feel.

### `enableParallax` (optional)
Enables subtle mouse-tracking parallax on geometric layers.

- `false` (default) - Micro depth animation only
- `true` - Layers respond to mouse with depth-based movement

**Recommendation:** Enable on hero/CTA sections only.

## Current Implementation

### Hero Section
```tsx
<LuxurySilkBackground intensity="subtle" speed="slow" enableParallax />
```

### Process Section
```tsx
<LuxurySilkBackground intensity="subtle" speed="slow" />
```

### Reviews Section
```tsx
<LuxurySilkBackground intensity="subtle" speed="slow" />
```

### Final CTA Section
```tsx
<LuxurySilkBackground intensity="medium" speed="slow" enableParallax />
```

## Technical Details

**Layers:**
- 5 geometric planes at varying depths (translateZ: 0 to -80px)
- Each plane uses clip-path for angular geometric shapes
- Asymmetrical composition - left side denser, right side balanced

**Depth System:**
- Near layers (translateZ: 0 to -25px) move 0.8-1px
- Mid layers (translateZ: -25 to -50px) move 0.4-0.6px  
- Far layers (translateZ: -50 to -80px) move 0.15-0.3px

**Color Palette:**
- Black: rgba(0, 0, 0)
- Deep charcoal: rgba(8-12, 8-12, 8-12)
- Charcoal: rgba(15-20, 15-20, 15-20)
- Graphite highlights: rgba(38-45, 38-45, 38-45)
- NO silver, NO bright edges

**Edge Highlights:**
- Thin lines (1.5-2px) with minimal blur (1-1.5px)
- Positioned on geometric edges to reveal form
- Opacity: 0.25-0.4 (very restrained)

## Customization

To adjust the composition, edit `LuxurySilkBackground.module.css`:

### Change Geometric Shapes
Modify `clip-path` values on `.planeLayer` elements:
```css
clip-path: polygon(0% 0%, 85% 0%, 70% 100%, 0% 100%);
```

### Adjust Depth Layers
Change `translateZ()` values (more negative = further back):
```css
transform: translateZ(-80px) rotateY(2deg);
```

### Modify Movement Amount
Edit animation keyframes - keep movements tiny (0.5-1%):
```css
@keyframes depthFloat1 {
  0%, 100% { transform: translateZ(-80px) translate(0%, 0%); }
  50% { transform: translateZ(-82px) translate(0.5%, -0.3%); }
}
```

### Tonal Range
Keep within black → charcoal → graphite range:
```css
rgba(8, 8, 8) to rgba(45, 45, 45) maximum
```

## Performance

- Uses CSS 3D transforms with hardware acceleration
- Reduced motion support included
- Mobile version reduces opacity and simplifies
- No JavaScript animation loops

## Accessibility

- `aria-hidden="true"` - Hidden from screen readers
- `pointer-events: none` - Doesn't interfere with interactions
- Respects `prefers-reduced-motion` media query
- Maintains text readability with vignette framing

