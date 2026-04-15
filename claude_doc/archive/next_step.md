# Proposed Next Steps

## 1. Participant ID Entry
Add a text field at the start of the config screen for a participant ID or name. Store it in each trial record and session record so data from different participants can be distinguished in the downloaded CSV.

## 2. Run Multiple N-Back Levels in Sequence
Optionally allow the user to select "All levels (1→2→3)" so the experiment runs all three levels in order (current research protocol). This could be a fourth option alongside 1-back / 2-back / 3-back.

## 3. Adaptive Difficulty
After each block, automatically adjust the n-back level based on accuracy (e.g., if accuracy > 80%, move to n+1; if < 50%, drop to n-1). This is the standard dual-n-back training protocol used in working memory research.

## 4. Configurable ISI (Inter-Stimulus Interval)
Add an option for the blank interval between letters (currently fixed at 500 ms). Common research values are 250 ms, 500 ms, and 1000 ms.

## 5. Per-Trial Feedback Mode
Add an optional training mode where the screen briefly flashes green (correct) or red (incorrect) after each trial, helping users learn the task before moving to the standard no-feedback protocol.

## 6. Session History Viewer
Add a button on the config screen (e.g., "View Past Sessions") that reads all sessions from IndexedDB and displays a table of previous session dates, n-back levels, and accuracy scores — so users can track progress over time without downloading CSV files.

## 7. Performance Chart
After the results table, display a simple bar or line chart (using the Canvas API or Chart.js) showing false alarm rate and miss rate per block, making it easier to spot performance trends within a session.

## 8. Mobile / Touch Support
Replace the spacebar response with a large on-screen tap button for tablet/phone use, since the current implementation requires a physical keyboard.

## 9. Qualtrics Config Integration
In `nback.js`, read config values from Qualtrics embedded data fields (e.g., `Qualtrics.SurveyEngine.getEmbeddedData("nback_level")`) so survey designers can pre-set the task parameters per respondent group without code changes.

## 10. Audio Stimulus Mode
In addition to letters, add an option to play spoken letters (A, B, C…) via the Web Audio API. This enables an auditory n-back variant and, when combined with the visual letter version, a dual n-back task.
