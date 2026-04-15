# N-Back Space Key Bug Report

## Bug 1 (Root cause): Invalid key `"+"` crashes every key press

In `nback-standalone.html` line 4168 (and `nback.js` line 252):

```js
choices: [" ", "+"],
```

When any key is pressed, jsPsych iterates through `choices` and calls `convertKeyCharacterToKeyCode()` on each string. The lookup table has `' ': 32` for space — that's fine. But `"+"` is **not in the lookup table**. The code then executes:

```js
// nback-standalone.html, line 2378-2380
} else {
    throw new Error('Invalid key string specified for getKeyboardResponse');
}
```

This exception fires on **every single key press** (including space), before `response = info` is ever reached. So `response.key` stays `null`, and `trial_data.key_press` is always `null`.

---

## Bug 2 (Consequence): All targets show as "Miss"

In `Record_Decision` (line 4229):

```js
var pressedSpace = trial_data.key_press === 32;  // always false — key_press is null
var correct = isTarget ? pressedSpace : ...;      // targets always "wrong"
```

Since `key_press` is always `null`, `pressedSpace` is always `false`, every target is a miss.

---

## Fix

**Remove `"+"` from `choices`** in two places:

**`nback-standalone.html`, line 4168:**
```js
choices: [" "],   // was: [" ", "+"]
```

**`nback.js`, line 252 (if used in Qualtrics):**
```js
choices: [" "],   // was: [" ", "+"]
```

The `"+"` key was never meaningful — `"+"` isn't in jsPsych v6's keylookup (the numpad plus is `"plus"`, keyCode 107). Removing it lets space register normally.

---

## Minor Secondary Issue: Stale `timeline_variables` reference

`Run_Block_Back.timeline_variables = BackArray` captures the initial array reference at object creation time. When `Set_BackArray` reassigns `BackArray`, `timeline_variables` still points to the old array. This does not break the core logic (iteration count stays correct since all arrays have the same length, and both `ShowStimulus` and `Record_Decision` read from the current `BackArray`), but `jsPsych.timelineVariable("condition")` in `ShowStimulus.data` will read from the stale initial array's conditions rather than the current block's conditions. This only affects the `Condition` column in raw jsPsych data — not the logic in `Record_Decision`.
