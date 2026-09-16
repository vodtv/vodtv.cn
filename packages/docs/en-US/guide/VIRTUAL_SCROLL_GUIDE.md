# Virtual‑Scroll Optimization Usage Guide

## 🚀 Feature Overview

LunaTV now supports virtual‑scrolling technology to drastically improve page‑level performance:

- **Virtualized rendering**: Render only content within the viewport, greatly reducing DOM node count
- **Seamless infinite scroll**: Smart preloading for completely unnoticeable scrolling experience
- **Dynamic threshold**: Automatically adjust loading trigger timing based on screen dimensions
- **Image optimization**: Prioritize‑load above‑the‑fold images, reuse cached loaded images
- **Responsive adaptation**: Intelligent layout for all screen sizes, from mobile phones up to 4K monitors
- **Toggle‑on‑demand**: Switch freely between virtual mode and legacy mode at any time

## 📱 Supported Pages

Virtual scrolling is available on the following routes:

- ✅ **Douban Page** (`/douban`)
- ✅ **Emby Private Media Library** (`/emby`)
- ✅ **Short‑Drama Page** (`/shortdrama`)

## 🎛️ How to Use

### Enable / Disable Virtual Scrolling

1. Locate the "⚡ Virtual Scroll" toggle button in the top‑right corner or filter bar of the page
2. Toggle state persists automatically inside local storage (saved independently per page)
3. Virtual‑scroll mode is enabled by default

### Local‑Storage Keys

‑ Douban page: `useDoubanVirtualization`
‑ Emby page: `useEmbyVirtualization`
‑ Short‑drama page: `useShortDramaVirtualization`

## ⚡ Performance Improvements

### Legacy Mode vs Virtualized Mode

‑ **Reduced DOM nodes**: Drop from 1000+ cards down to only 20‑50 nodes
‑ **Memory footprint**: 60‑80% memory reduction
‑ **Rendering time**: 3‑5× rendering speed gain
‑ **Scroll smoothness**: Noticeably better, especially on low‑end devices and mobile browsers

### Seamless Infinite Scroll

‑ **Smart preloading**: Trigger next‑batch loading when reaching 3 rows above bottom
‑ **Dynamic threshold**: Adjust trigger point automatically based on viewport height
 ‑ Mobile (700px viewport): approx 5‑6‑row threshold
 ‑ Desktop PC (1080px viewport): approx 6‑7‑row threshold
‑ **Zero visual flicker**: No visible "Loading…" indicator under normal‑speed scrolling

### Image Optimization

‑ Priority loading: First‑screen top‑30 images load immediately (`priority={true}`)
‑ Lazy loading: Remaining images use `loading="lazy"`
‑ In‑memory image cache: Already fetched URLs stored inside a `loadedImageUrls` Set
‑ Cache reuse: During virtual‑list re‑rendering cached images show instantly

## 🔧 Technical Implementation

### Core Component

‑ **`VirtualGrid.tsx`**: Unified virtualized grid component
 ‑ Built upon `@tanstack/react‑virtual`
 ‑ Auto‑detect CSS‑Grid column quantity
 ‑ Implements `endReached` callback hook

### Dependencies

```
{
  "@tanstack/react-virtual": "^3.x.x"
}
```

### Key Implementation Details

#### 1. Dynamic Column Detection

Use an invisible probe element to compute actual CSS‑Grid column count:

```
const probeRef = useRef<HTMLDivElement>(null);
const detectColumns = () => {
  const style = window.getComputedStyle(probeRef.current);
  const cols = style.gridTemplateColumns.split(' ').length;
  setColumns(cols);
};
```

#### 2. Dynamic Threshold Calculation

Compute preload trigger threshold dynamically from viewport & estimated row height:

```
const viewportHeight = window.innerHeight;
const visibleRows = Math.ceil(viewportHeight / estimateRowHeight);
const dynamicThreshold = Math.max(visibleRows + endReachedThreshold, endReachedThreshold);
```

#### 3. endReached Callback

Hook into virtualizer state instead of raw DOM scroll listeners:

```
if (lastRowIndex >= rowCount - dynamicThreshold) {
  endReached(); // fire load‑more event
}
```

### Compatibility

‑ ✅ React 18+
‑ ✅ Modern browsers (Chrome 88+, Firefox 78+, Safari 14+)
‑ ✅ Mobile browsers
‑ ✅ PWA applications

## 🎯 Best Practices

### When to enable virtual scrolling

‑ ✅ Dataset exceeds 50 list items
‑ ✅ Running on lower‑performance hardware
‑ ✅ Mobile‑first usage scenario
‑ ✅ Infinite‑scroll pagination required

### When to fall back to legacy mode

‑ ✅ Small dataset (<20 entries)
‑ ✅ Need quick visual scan over all results
‑ ✅ Development & debugging work
‑ ✅ Page printing requirement

## 🛠️ Developer Notes

### Integrate VirtualGrid onto a new page

1. Import the VirtualGrid component:

```
import VirtualGrid from '@/components/VirtualGrid';
```

2. Initialize virtualization state persisted to localStorage:

```
const [useVirtualization, setUseVirtualization] = useState(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('useYourPageVirtualization');
    return saved !== null ? JSON.parse(saved) : true;
  }
  return true;
});
```

3. Render VirtualGrid component:

```
<VirtualGrid
  items={data}
  className='grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'
  rowGapClass='pb-4'
  estimateRowHeight={280}
  endReached={() => {
    if (hasMore && !loading) {
      loadMore();
    }
  }}
  endReachedThreshold={3}
  renderItem={(item, index) => (
    <YourCard item={item} priority={index < 30} />
  )}
/>
```

### Parameter Tuning

#### estimateRowHeight

Set value matching your card’s real rendered height:
‑ Douban / Emby: `320px` (poster + title + vertical spacing)
‑ Short‑drama: `280px` (cover + title + vertical spacing)

#### endReachedThreshold

Base offset value, will be summed with visible row count dynamically:
‑ Recommended base: `2‑3`
‑ Automatically expands to 5‑6 rows for mobile viewports
‑ Automatically expands to 6‑7 rows for desktop viewports

#### overscan

Number of extra rows pre‑rendered above & below viewport:
‑ Default: `3`
‑ Larger values improve scroll smoothness at cost of extra DOM nodes

### Image‑cache Integration

1. Extend your card component props:

```
interface CardProps {
  priority?: boolean;
}
```

2. Conditional loading strategy:

```
<img
  loading={priority ? undefined : 'lazy'}
  onLoad={() => {
    loadedImageUrls.add(imageUrl);
    setImageLoaded(true);
  }}
/>
```

3. Restore cached‑image state on component mount:

```
const [imageLoaded, setImageLoaded] = useState(() =>
  loadedImageUrls.has(imageUrl)
);
```

## 📊 Performance Profiling

### Chrome DevTools

1. **Performance panel**:
  ‑ Record loading & scrolling session
  ‑ Compare FPS with virtualization toggled on/off
  ‑ Inspect DOM element quantity changes
2. **Memory panel**:
  ‑ Compare heap memory consumption
  ‑ Watch for potential memory leaks
3. **Lighthouse audit**:
  ‑ Measure LCP (Largest Contentful Paint)
  ‑ Measure TBT (Total Blocking Time)

### Console Debug Snippets

```
// Inspect virtual‑scroll toggle states
console.log('Douban virtualization:', localStorage.getItem('useDoubanVirtualization'));
console.log('Emby virtualization:', localStorage.getItem('useEmbyVirtualization'));
console.log('Short‑drama virtualization:', localStorage.getItem('useShortDramaVirtualization'));
// Check cached image counter
console.log('Cached image count:', loadedImageUrls.size);
```

## 🐛 Troubleshooting

### Known Common Issues

1. **Scroll jank / stuttering**
‑ Verify browser hardware acceleration is active
‑ Lower the `overscan` parameter
‑ Check for oversized unoptimized image assets
2. **Broken grid layout / misaligned cards**
‑ Ensure `estimateRowHeight` approximates real card height
‑ Double‑check your CSS Grid layout configuration
‑ Confirm vertical spacing is accounted for via `rowGapClass`
3. **Slow‑loading images**
‑ Make sure top‑screen cards receive `priority={true}`
‑ Confirm URLs get registered inside `loadedImageUrls` cache
‑ Deploy CDN for static image delivery
4. **"Loading…" indicator still visible during scrolling**
‑ Increase base `endReachedThreshold` value
‑ Check actual network latency
‑ Reduce item batch‑size per pagination load

### Debugging Snippets

1. Inspect rendered row quantity:

```
console.log('Visible virtual rows:', virtualizer.getVirtualItems().length);
console.log('Total grid rows:', Math.ceil(items.length / columns));
```

2. Trace endReached trigger events:

```
endReached={() => {
  console.log('Trigger load‑more, total items:', items.length);
  loadMore();
}}
```

3. Log dynamic threshold computation:

```
const viewportHeight = window.innerHeight;
const visibleRows = Math.ceil(viewportHeight / 320);
console.log('Visible rows:', visibleRows);
console.log('Final dynamic threshold:', visibleRows + 3);
```

## 🔄 Migration Guide (from legacy react‑virtuoso)

If previously adopting `react‑virtuoso`:

1. Uninstall legacy package:

```
pnpm remove react-virtuoso
```

2. Install new virtualization dependency:

```
pnpm add @tanstack/react-virtual
```

3. Component replacement:
‑ `VirtuosoGrid` → `VirtualGrid`
‑ Keep existing `endReached` callback logic unchanged
‑ Remove virtuoso‑exclusive props e.g. `increaseViewportBy`
4. Migrate localStorage keys to avoid old‑state conflicts

---

💡 **Tip**: Virtual‑scroll is best suited for rendering large lists. Combined with image caching & priority‑based image loading it brings substantial UX gains. It is recommended to activate when your list holds more than 50 entries.

