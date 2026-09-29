# Embedding nback-touchscreen-standalone.html in Qualtrics

## Strategy

The touchscreen file is ~4 600 lines — too large to paste directly into the Qualtrics HTML editor.
The cleanest approach is:

1. **Host** the file on GitHub Pages (free, no backend).
2. **Embed** it in a Qualtrics question via `<iframe>`.
3. **Pass scores back** from the iframe to Qualtrics using `window.parent.postMessage`.
4. **Receive scores** in Qualtrics JavaScript and save them as Embedded Data.

Data that ends up in Qualtrics Embedded Data is automatically included in every CSV export.

---

## Part 1 — Modify `nback-touchscreen-standalone.html` (one edit)

Open `nback-touchscreen-standalone.html` and find the `on_finish` callback inside `initExp()`.
It is around **line 4513** and looks like:

```javascript
on_finish: function() {
    console.log("Experiment completed!");
    if (config.showResults) {
```

Replace that entire `on_finish` block with the version below.
The only addition is the `window.parent.postMessage(...)` block; everything else is unchanged.

```javascript
on_finish: function() {
    console.log("Experiment completed!");

    // --- postMessage to Qualtrics (added for iframe embedding) ---
    var nback      = config.nbackLevel;
    var fa         = parseInt(localStorage.getItem("nBack" + nback + "FA")   || "0", 10);
    var miss       = parseInt(localStorage.getItem("nBack" + nback + "MISS") || "0", 10);
    var blockLabel = "block-" + nback + "back";
    var allData    = jsPsych.data.get().filter({ block: blockLabel });
    var hits       = allData.filter({ hit: 1 }).count();
    var cr         = allData.filter({ CR: 1 }).count();
    var total      = allData.count();
    var accuracy   = total > 0 ? ((hits + cr) / total * 100).toFixed(1) : "0.0";
    window.parent.postMessage({
        type:       "nback-complete",
        nbackLevel: String(nback),
        nBackFA:    String(fa),
        nBackMISS:  String(miss),
        hits:       String(hits),
        accuracy:   accuracy
    }, "*");
    // --- end postMessage block ---

    if (config.showResults) {
        displayResults(config);
    } else {
        document.getElementById("display_stage").innerHTML =
            "<div style='text-align:center;padding:80px;'>" +
            "<h2>Task Complete</h2>" +
            "<p>Thank you for participating. Your data has been saved to the local database.</p>" +
            "<button onclick='downloadTrialData()' style='margin:8px;padding:12px 24px;font-size:16px;" +
            "background:#5cb85c;color:white;border:none;border-radius:6px;cursor:pointer;'>" +
            "Download Trial Data</button>" +
            "</div>";
    }
},
```

Save the file.

---

## Part 2 — Host the file on GitHub Pages

### 2a. Push to GitHub

If the repo is not yet on GitHub:

```bash
# from the repo root
git remote add origin https://github.com/YOUR-USERNAME/n-back.git
git push -u origin main
```

If the repo is already on GitHub, just commit and push the edit you made in Part 1:

```bash
git add nback-touchscreen-standalone.html
git commit -m "add postMessage for Qualtrics iframe integration"
git push
```

### 2b. Enable GitHub Pages

1. On GitHub, open the repo → **Settings** → **Pages** (left sidebar).
2. Under **Branch**, select `main` and folder `/` (root). Click **Save**.
3. Wait ~60 seconds. GitHub will show the URL:
   ```
   https://YOUR-USERNAME.github.io/n-back/
   ```
4. Verify the file loads:
   ```
   https://YOUR-USERNAME.github.io/n-back/nback-touchscreen-standalone.html
   ```

Copy this URL — you will paste it into the iframe in Part 3.

---

## Part 3 — Set up Qualtrics Embedded Data

In Qualtrics, go to **Survey** → **Survey Flow** (top toolbar).

Click **Add a New Element Here** → **Embedded Data**.
Place this block **before** the n-back question block.

Add these fields (leave values blank — the JavaScript will fill them at runtime):

| Field name            | Description                          |
|-----------------------|--------------------------------------|
| `nBackLevel`          | Which n-back level was run (1, 2, 3) |
| `nBackFA`             | False alarms                         |
| `nBackMiss`           | Misses                               |
| `nBackHits`           | Hits                                 |
| `nBackAccuracy`       | Overall accuracy (%)                 |
| `nBackAvgRT`          | Average reaction time on hits (ms)   |
| `nBackParticipantId`  | Participant ID entered at task start |

Click **Save Flow**.

---

## Part 4 — Create the Qualtrics question

### 4a. Add a new question

In the survey editor, add a question to the block where you want the n-back task.
Set the question type to **Text / Graphic** (no response required).

### 4b. Paste the iframe HTML

Click **HTML View** on the question and paste the contents of
`qualtrics/qualtrics-iframe.html` (see that file in this folder).

> **Edit the `src=` URL** to match your actual GitHub Pages URL from Part 2b.

### 4c. Paste the Qualtrics JavaScript

Click the gear icon on the question → **Add JavaScript**.
Delete the default stub entirely and paste the contents of
`qualtrics/qualtrics-listener.js` (see that file in this folder).

---

## Part 5 — Configure the question display

In the question editor:

- Set **Question text** to something neutral, e.g. `Cognitive Task` or leave it blank.
- Under **Question behavior** (gear icon) → check **Hide question text** if you want only the game to show.
- Make sure the question is **not** skippable (no validation needed because the JS hides the Next button and only shows it after the game ends).

---

## Part 6 — Test in Qualtrics Preview

1. Click **Preview Survey** in Qualtrics.
2. The config screen of the n-back task should appear inside the iframe.
3. Run a short test (set n-back level to 1, number of letters to 6 via the config screen).
4. After the game ends, Qualtrics should automatically advance to the next question.
5. On the final confirmation page, click **View Results** in Qualtrics (Tools → View Results) and check that the embedded data columns are populated.

### Common issues

| Symptom | Fix |
|---|---|
| Iframe shows blank / "refused to connect" | GitHub Pages not yet enabled, or wrong URL in `src=` |
| Game loads but Next never advances | The `postMessage` block was not added in Part 1, or origin mismatch — check the browser console |
| Fullscreen button does nothing | iOS Safari blocks fullscreen inside iframes; remove `FullScreenOn` from the timeline or add `allow="fullscreen"` on the `<iframe>` tag |
| Embedded data columns empty | Embedded Data block in Survey Flow is placed after the question — move it before |
| Audio does not play on iPad | iOS requires a user gesture first; the "Start Task" button in the config screen already handles this if Part 1 was applied correctly |
| Console shows "embedded data written" but export is still empty | See **Verifying data actually saves** below |

### Known issue: "Simple" layout silently discards JS embedded data

If the console shows the message received and no errors, the survey completes
(`Finished=1` in the export), the columns exist — but every JS-set value is empty,
the survey is almost certainly using Qualtrics' new **Simple layout** (new React
survey engine). In that engine `setEmbeddedData` is deprecated and effectively a
no-op, and `setJSEmbeddedData` may be missing from the question instance.

**Fix:** Look & Feel (paintbrush icon) → **Layout** → switch from **Simple** to
**Flat** (or Classic). Save and **re-publish**. The classic engine loads instead,
where `Qualtrics.SurveyEngine.setEmbeddedData` persists correctly. No code changes
are needed.

### Verifying data actually saves

1. **Piped-text check** — add a Text/Graphic question on the page *after* the game containing
   `${e://Field/nBackLevel} ${e://Field/nBackFA} ${e://Field/nBackMiss} ${e://Field/nBackHits} ${e://Field/nBackAccuracy} ${e://Field/nBackAvgRT} ${e://Field/nBackParticipantId}`.
   If values render on screen, the JS write works and the problem is in recording/export.
2. **Complete the survey to the End of Survey page.** Sessions abandoned mid-survey sit in
   *Data & Analysis → Responses in Progress* and are excluded from all exports. This is the
   most common cause of empty columns during testing.
3. **Inspect one response directly** — in Data & Analysis click the newest response row and
   check its Embedded Data section, bypassing export settings entirely.
4. **Re-publish after editing question JS** if testing via the anonymous link — the live link
   serves the last published version; only Preview runs the draft.
5. **Field names are case-sensitive** — Survey Flow fields must exactly match what the
   listener writes: `nBackLevel`, `nBackFA`, `nBackMiss`, `nBackHits`, `nBackAccuracy`,
   `nBackAvgRT`, `nBackParticipantId`.

---

## Part 7 — What lands in your Qualtrics CSV

After data collection, download responses as CSV. You will see these columns alongside all other survey answers:

```
nBackLevel  nBackFA  nBackMiss  nBackHits  nBackAccuracy  nBackAvgRT  nBackParticipantId
2           3        5          7          71.4           412         p001
```

These are the summary scores per participant per session.
If you need trial-level data (every stimulus, RT, correct/incorrect), use the
**Download Trial Data** button that appears at the end of the game — it exports
a separate CSV from the browser's IndexedDB.
