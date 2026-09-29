# iPad / Touchscreen Compatibility Proposal

**Date:** 2026-04-15
**Scope:** `nback-standalone.html` (primary target); `nback.js` / `nback.html` (Qualtrics) as secondary

---

## Problem Summary

The current n-back implementation responds exclusively to the **spacebar** (`choices: [" "]`).
On an iPad (or any touchscreen without a physical keyboard), there is no spacebar, so participants cannot register responses. Additionally:

- jsPsych 6.1's `html-keyboard-response` plugin ignores touch events.
- Full-screen mode behaves differently in Safari/iPadOS.
- Default font sizes and button hit-areas are designed for mouse/cursor interaction.

---

## Proposed Changes

### 1. Add a Touch Response Button

Replace the invisible "press spacebar" paradigm with a large, visible **TAP button** that appears during every stimulus trial.

```
┌──────────────────────────────┐
│                              │
│          [ LETTER ]          │   ← stimulus (centered, large)
│                              │
│  ┌────────────────────────┐  │
│  │        TAP HERE        │  │   ← full-width touch button
│  └────────────────────────┘  │
│                              │
└──────────────────────────────┘
```

**Implementation approach:**
Switch stimulus trials from `html-keyboard-response` to `html-button-response` with a single large button whose label is "TAP" (or left blank with a distinctive color). Style with `min-height: 120px` and `font-size: 2rem` for easy tapping.

Keyboard support (spacebar) is preserved by also listening to `keydown` events on the same trial — so desktop users are unaffected.

---

### 2. Dual Input: Touch + Keyboard

Add a thin compatibility shim that maps `touchstart` events on the tap button to a synthetic `keydown` event (key = `" "`). This lets jsPsych's existing response-collection logic work without rewriting the core timing engine.

```js
tapButton.addEventListener('touchstart', function(e) {
    e.preventDefault(); // block scroll / double-tap zoom
    var syntheticKey = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    document.dispatchEvent(syntheticKey);
}, { passive: false });
```

---

### 3. Prevent Common iPad Safari Issues

| Issue | Fix |
|-------|-----|
| Double-tap zoom on button | `touch-action: manipulation` CSS on the tap button |
| 300 ms click delay | `touch-action: manipulation` (also removes delay) |
| Accidental scrolling during task | `body { overflow: hidden; touch-action: none; }` during trials |
| iOS full-screen API not available | Fall back gracefully; hide the full-screen toggle button on iOS |
| Audio autoplay blocked | Pre-warm audio on first user gesture (the config screen "Start" button tap) |
| Virtual keyboard popping up | Ensure no `<input>` fields are focused during trials |

---

### 4. Responsive Layout Adjustments

- Use `vw`/`vh` units for stimulus font size so it scales to iPad screen sizes.
- Config screen buttons: increase `min-height` to 56px and `font-size` to 1.25rem.
- Letter stimulus: scale from current `30pt` to `min(12vw, 5rem)`.
- Instruction screens: add `max-width: 90vw` with comfortable padding.

---

### 5. Viewport Meta Tag

Ensure the HTML `<head>` includes:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0,
      maximum-scale=1.0, user-scalable=no">
```

This prevents accidental pinch-zoom during the task.

---

## Files to Modify

| File | Changes |
|------|---------|
| `nback-standalone.html` | Primary: add tap button, shim, viewport meta, CSS fixes |
| `nback.js` | Secondary: same shim + CSS injected via `Qualtrics.SurveyEngine.addOnload` |
| `nback.html` | Minor: viewport meta tag, no logic changes |

---

## What Does NOT Change

- Trial timing (stimulus duration 1500 ms, ISI 500 ms) — unchanged.
- Scoring logic (hits, misses, false alarms) — unchanged.
- Data output variables — unchanged.
- Desktop keyboard (spacebar) still works — unchanged.
- Qualtrics integration — unchanged.

---

## Implementation Plan (Ordered Steps)

1. **Add viewport meta tag** to `nback-standalone.html`.
2. **Inject CSS**: `touch-action`, `overflow: hidden`, responsive font sizes, tap button styles.
3. **Create tap button element** and insert it into the jsPsych display container on each trial start via `on_start` callback.
4. **Add touchstart shim** that fires synthetic keyboard event.
5. **Fix iOS audio**: pre-warm the audio object on config-screen "Start" tap.
6. **Handle full-screen gracefully** on iOS (detect `document.fullscreenEnabled`).
7. **Test on iPad Safari** with both 1-back, 2-back, and 3-back levels.
8. **Apply same changes to `nback.js`** for Qualtrics deployment.

---

## Risk & Mitigation

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Touch shim fires twice (touch + click) | Medium | Use `e.preventDefault()` on `touchstart` to suppress the subsequent `click` |
| Timing offset from touch latency | Low | jsPsych timestamps `rt` from first input; touch latency (~50ms) is within normal human RT variance |
| Safari blocking fullscreen API | High (iOS) | Already mitigated by graceful fallback in step 6 |
| Audio not playing on first trial | Medium | Pre-warm in step 5 resolves this |

---

## Next Step

Implement changes in `nback-standalone.html` first (steps 1–7), then port to `nback.js`.
