# Luxury 3D Architectural Background (Three.js)

A premium black-on-black 3D sculptural background built with Three.js and React Three Fiber. Creates ONE coherent architectural installation with real depth, real lighting, and believable material.

## Why Three.js Instead of CSS

Three.js gives you what CSS overlays cannot:
- Real 3D depth and perspective
- Real lighting and shadows
- Believable material properties (metalness, roughness)
- Subtle motion that doesn't look fake
- A custom luxury asset instead of a wallpaper effect

## Design Philosophy

This is ONE dominant sculptural form - not scattered shapes. It feels like:
- A luxury automotive reveal campaign
- A premium architectural installation partially visible in the frame
- A high-end real estate presentation
- A fashion house microsite
- A private banking brand site

## Visual Composition

**Left 30%:** 3D sculptural wall enters from edge (heavy)  
**Center 40%:** Clean for text content  
**Right 30%:** Natural fade to pure black

The sculpture is partially cropped - you only see 30% of the "installation" which makes it feel custom and intentional.

## Usage

```tsx
import LuxuryArchitecturalBackground from '@/src/components/ui/LuxuryArchitecturalBackground'

<section className="relative overflow-hidden bg-black py-28">
  <LuxuryArchitecturalBackground />
  
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</section>
```

## Technical Details

### 3D Structure
- 13 rows × 10 columns of geometric "fins"
- Each fin is a box geometry with varying dimensions
- Positioned in a wave pattern with depth variation
- Creates one coherent layered relief structure

### Material Properties
```tsx
color: "#090a0c"        // Dark graphite-black
metalness: 0.72         // Subtle metallic quality
roughness: 0.58         // Matte finish, not glossy
envMapIntensity: 0.32   // Restrained environment reflection
```

### Lighting System
- Ambient light: 0.16 intensity (very low, maintains black dominance)
- Directional light: Soft from upper left, reveals form
- Spotlight: Moves subtly, creates dimensional highlights
- Fog: Fades sculpture naturally into black background

### Animation
- Group rotation: ±0.015 radians (barely perceptible breathing)
- Individual fin rotation: ±0.025 radians per fin
- Depth oscillation: ±0.06 units (micro movement)
- Spotlight drift: Creates living light quality

### Performance Optimization
- Hidden on mobile (uses simple gradient fallback)
- DPR capped at 1.5 for performance
- Hardware-accelerated rendering
- Efficient geometry reuse

## Gradient Overlays

Two gradients ensure text readability:

**Horizontal fade:**
```
Left 18%: Transparent (shows sculpture)
38-56%: Heavy fade (protects text)
100%: Pure black
```

**Radial vignette:**
```
Center: Transparent
Edges: Darkened for natural framing
```

## Mobile Fallback

On screens < 768px, Three.js canvas is hidden and replaced with a simple CSS gradient:
```css
linear-gradient(135deg, 
  rgba(12,12,12,0.8) 0%, 
  rgba(8,8,8,0.9) 30%, 
  rgba(0,0,0,1) 60%
)
```

## Customization

### Make it More Dramatic
Increase rows/cols in `ArchitecturalWall()`:
```tsx
const rows = 15;  // More density
const cols = 12;
```

### Adjust Size
Change the x-axis spread:
```tsx
const x = -6.2 + nx * 7.0;  // Wider sculpture
```

### Change Material Feel
Adjust material properties:
```tsx
<meshStandardMaterial
  color="#0a0b0d"      // Lighter/darker
  metalness={0.85}     // More metallic
  roughness={0.45}     // More glossy
  envMapIntensity={0.4} // More reflection
/>
```

### Modify Movement
Change animation speeds in `useFrame()`:
```tsx
// Slower breathing
Math.sin(t * 0.15 + index * 0.12) * 0.02

// Faster movement
Math.sin(t * 0.35 + index * 0.25) * 0.08
```

### Adjust Lighting
Modify spotlight intensity/position:
```tsx
<spotLight
  position={[4.5, 2, 6]}    // Different angle
  intensity={2.2}            // Brighter
  angle={0.45}               // Wider beam
/>
```

## Current Implementation

### Process Section
```tsx
<LuxuryArchitecturalBackground />
```
Fills large black space with sculptural depth

### Reviews Section
```tsx
<LuxuryArchitecturalBackground />
```
Adds premium atmosphere behind review cards

### Final CTA Section
```tsx
<LuxuryArchitecturalBackground />
```
Creates dramatic final impression

## Why This Works

**ONE coherent object** - Not scattered polygons  
**Real material** - Metalness, roughness, lighting  
**Believable depth** - True 3D perspective  
**Subtle motion** - Barely perceptible breathing  
**Partial visibility** - Cropped like a custom installation  
**Authority** - Feels like a billion-dollar brand asset

## Dependencies

```json
{
  "three": "^0.160.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.92.0"
}
```

## Performance Notes

- Canvas only renders on desktop (md: breakpoint)
- Uses `powerPreference: "high-performance"`
- Shadows enabled for realism
- Fog helps with depth perception and performance
- DPR limited to 1.5 to balance quality and speed

## Accessibility

- `pointer-events: none` - Doesn't interfere with interactions
- Pure visual enhancement - no functional elements
- Mobile fallback ensures all users see appropriate content
- Text remains highly readable with gradient overlays
