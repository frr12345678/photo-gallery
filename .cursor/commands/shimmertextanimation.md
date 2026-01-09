# Shimmer Text Animation

Apply a shimmer/gradient text animation to the selected element using this CSS pattern:

## CSS Code

```css
.animated-text {
  background: linear-gradient(
    135deg,
    var(--color-text-primary) 0%,
    var(--color-accent-primary) 50%,
    var(--color-text-primary) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
}
```

## How It Works

1. **Gradient Background**: 3-stop gradient (light -> accent -> light) at 135 degree angle
2. **Extended Background Size**: `200% auto` makes gradient twice as wide as element
3. **Text Clipping**: `background-clip: text` + `text-fill-color: transparent` shows gradient only inside text
4. **Animation**: Slides `background-position` from 200% to -200% creating flowing shimmer effect

## Customization

- **Gradient angle**: Change `135deg` for different flow direction
- **Animation speed**: Adjust `4s` duration (lower = faster)
- **Colors**: Replace CSS variables with hex colors like `#f5f5f5`, `#c9a962`
- **Background size**: Increase `200%` for smoother, more gradual transition

## Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  .animated-text {
    animation: none;
    background-position: 50% center;
  }
}
```
