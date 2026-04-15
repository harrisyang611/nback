# Solutions: Recording Accuracy & Returning Results in N-Back Task

## What already exists in `nback-standalone.html`

The existing code already collects:
- `hit` (1/0) — target trial where space was pressed correctly
- `CR` (1/0) — non-target trial where space was correctly not pressed
- `correct` (1/0) — overall correctness per trial
- `falsealarmCounter`, `missCounter` — running totals
- `rt` — reaction time per trial (stored in IndexedDB)
- Full trial data saved to IndexedDB via `dbSaveTrial()`

**Gap:** The end-of-game results screen only shows raw FA and MISS counts, not derived accuracy metrics.

---

## Solution 1 (Recommended): Enhance `displayResults()` — no structural changes needed

Compute accuracy metrics from the data already in IndexedDB (`dbGetSessionTrials`) and localStorage (`nBackNFA`, `nBackNMISS`).

**Metrics to add:**
| Metric | Formula |
|--------|---------|
| Hit Rate | hits / (hits + misses) |
| False Alarm Rate | FA / (FA + correct rejections) |
| Overall Accuracy | (hits + CR) / total trials |
| Avg RT (hits only) | mean of `rt` where `responseType === 'Hit'` |

**How:** Modify the `displayResults(config)` function to call `dbGetSessionTrials()`, compute the above from the returned trial array, and render them in the existing table.

**Effort:** ~30 lines of JS added to the existing `displayResults()` function.

---

## Solution 2: Add accuracy metrics inline via `jsPsych.data`

jsPsych already stores all trial data internally. At `on_finish`, use:

```js
var data = jsPsych.data.get().filter({block: 'block-' + selectedNback + 'back'});
var hits     = data.filter({hit: 1}).count();
var misses   = data.filter({hit: 0, correct: 0}).count();  // targets, wrong
var fa       = data.filter({CR: 0, correct: 0}).count();   // non-targets, pressed
var cr       = data.filter({CR: 1}).count();
var hitRate  = hits / (hits + misses);
var faRate   = fa  / (fa  + cr);
var accuracy = (hits + cr) / data.count();
var avgRT    = data.filter({hit: 1}).select('rt').mean();
```

Then render a summary `<div>` in `#display_stage`.

**Advantage:** No IndexedDB read needed; fully synchronous.

**Effort:** ~40 lines; replace the current `on_finish` body in `jsPsych.init()`.

---

## Solution 3: Show a per-block live progress bar (optional add-on)

After each `Run_Block_Back`, insert a `call-function` node that computes and briefly displays accuracy for that block before `Show_Continue`. This gives participants mid-task feedback.

---

## Recommendation

**Use Solution 2** for simplicity and reliability:
- No async IndexedDB read at display time
- Works offline with zero dependencies
- Fits naturally into the existing `on_finish` callback

**Add Solution 1 as a fallback** — the IndexedDB data is already being written, so the download CSV button already works; just improve the summary table rendering.

---

## For `nback.js` (Qualtrics version)

The Qualtrics version saves FA and MISS per condition via `Qualtrics.SurveyEngine.setEmbeddedData`. To add accuracy, also set:

```js
Qualtrics.SurveyEngine.setEmbeddedData(
    "nBack" + currentnback + "ACC",
    ((nItemsTarget - missCounter) / nItemsTarget * 100).toFixed(1)
);
```

This writes hit-rate accuracy (%) as an embedded field for each n-back level.

---

## Future Goal: Export to Local SQLite Database

### Architecture

```
nback-standalone.html  (runs in browser)
        |
        | POST http://localhost:5001/save  (JSON)
        v
  server.py  (Flask + sqlite3, runs in terminal)
        |
        v
  results.db  (SQLite file in your project folder)
```

### server.py

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3, os, json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'results.db')
app = Flask(__name__)
CORS(app)  # allow requests from file:// origin

def get_db():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con

def init_db():
    with get_db() as con:
        con.execute('''CREATE TABLE IF NOT EXISTS trials (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            saved_at      TEXT,
            session_id    TEXT,
            nback_level   INTEGER,
            trial_number  INTEGER,
            stimulus      TEXT,
            condition     TEXT,
            key_pressed   TEXT,
            correct       INTEGER,
            response_type TEXT,
            rt            REAL,
            hit           INTEGER,
            cr            INTEGER,
            block         TEXT
        )''')

@app.route('/save', methods=['POST'])
def save():
    trials = request.get_json()
    if not trials:
        return jsonify({'error': 'no data'}), 400
    saved_at = datetime.utcnow().isoformat()
    with get_db() as con:
        for t in trials:
            con.execute('''INSERT INTO trials
                (saved_at, session_id, nback_level, trial_number, stimulus,
                 condition, key_pressed, correct, response_type, rt, hit, cr, block)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)''', (
                saved_at,
                t.get('sessionId') or t.get('session_id', ''),
                t.get('nbackLevel') or t.get('nback_level'),
                t.get('trialNumber') or t.get('trial_number'),
                t.get('stimulus', ''),
                t.get('condition', ''),
                t.get('keyPressed') or t.get('key_pressed', ''),
                t.get('correct'),
                t.get('responseType') or t.get('response_type', ''),
                t.get('rt'),
                t.get('hit'),
                t.get('CR') or t.get('cr'),
                t.get('block', '')
            ))
    return jsonify({'saved': len(trials)})

if __name__ == '__main__':
    init_db()
    print(f"DB: {DB_PATH}")
    app.run(port=5001)
```

### Install & run

```bash
pip install flask flask-cors
python server.py
```

### Add to `nback-standalone.html` — inside `on_finish`

```js
// POST all trial data to local server
var trials = jsPsych.data.get().filter({block: 'block-' + selectedNback + 'back'}).values();
fetch('http://localhost:5001/save', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(trials)
}).then(function(r){ return r.json(); })
  .then(function(d){ console.log('Saved to SQLite:', d.saved, 'trials'); })
  .catch(function(e){ console.warn('Server not running, skipping DB save:', e); });
```

The `catch` means the page still works normally if the server is not running.

### Query the database

```python
import sqlite3, pandas as pd
con = sqlite3.connect('results.db')
df = pd.read_sql('SELECT * FROM trials', con)
print(df.groupby(['nback_level','response_type']).size())
```
