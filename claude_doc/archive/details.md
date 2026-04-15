# N-Back Task in Qualtrics - Detailed Documentation

## What This Paper Is About

This paper is a tutorial published in "The Quantitative Methods for Psychology" (2023, Vol. 19, no. 2) by Meenakshie Bradley-Garcia and Victoria Bolton from the University of Ottawa. It provides a comprehensive guide for programming an n-back task in Qualtrics using HTML and JavaScript.

### The N-Back Task

The n-back task is a widely-used cognitive test that assesses **working memory**. Working memory is a mental process that allows for temporary retention and manipulation of information.

**How it works:**
- Participants see a sequence of stimuli (letters, numbers, or images) presented one at a time
- For each stimulus, participants must determine if it matches a stimulus shown **n** positions back
- **1-back**: Compare current stimulus to the one shown 1 position back
- **2-back**: Compare current stimulus to the one shown 2 positions back
- **3-back**: Compare current stimulus to the one shown 3 positions back

**Example (1-back):**
- Sequence: L, O, O, B, O, R, P, P, R
- Correct responses: Press spacebar when "O" appears the second time (matches previous), and when "P" appears the second time

**Scoring:**
- **Hits**: Correct identification when stimulus matches
- **Misses**: Failing to respond when stimulus matches
- **False alarms**: Incorrectly responding when stimulus doesn't match
- **Correct rejections**: Correctly not responding when stimulus doesn't match

### Why This Tutorial Is Important

1. **Online Research**: Post-COVID, many researchers prefer or need to conduct experiments online
2. **Standardization**: Virtual n-back tasks produce similar results to in-person testing
3. **Accessibility**: Makes neurocognitive assessment available to researchers with limited programming knowledge
4. **Real-World Application**: Provides actual working code with a realistic example

## How to Use the Code

The tutorial provides two main code components:

### 1. JavaScript Code (Appendix A)
- **Lines 1-520+**: Complete n-back task implementation
- Uses **jsPsych** version 6.1 library for experiment control
- Implements:
  - Stimulus presentation timing
  - Trial sequencing (1-back, 2-back, 3-back)
  - Response recording (spacebar press detection)
  - Score calculation (hits, misses, false alarms)
  - Data export to Qualtrics embedded data

### 2. HTML Code (Appendix B)
- **Lines 1-46**: Styling and layout
- Links to jsPsych libraries hosted on GitHub
- Creates display stage with white background
- Handles loading messages
- Styles the experiment interface

### Key Components:

**Variables to Configure:**
- `StimDuration`: How long each stimulus is shown (default: 1500ms)
- `ISIDuration`: Inter-stimulus interval (default: 500ms)
- `nItemsTotal`: Total number of stimuli per sequence (default: 30)
- `nItemsTarget`: Number of target items (default: 10)
- `nLeadingDistr`: Leading distractor items (default: 3)
- `MaxError`: Maximum errors allowed before ending (default: 24)

**Trial Structure:**
1. Practice session (1-back with sound feedback)
2. Main 1-back task (90 trials)
3. Optional 2-back task (90 trials, if performance is adequate)
4. Optional 3-back task (90 trials, if performance is adequate)

## How to Make the JavaScript Work By Itself

To run the n-back task as a standalone application:

### Option 1: Simple HTML File

1. **Create an HTML file** (e.g., `nback-test.html`)
2. **Include the HTML from Appendix B** as your base structure
3. **Include the JavaScript from Appendix A** within `<script>` tags
4. **Modify the jsPsych initialization** (remove Qualtrics-specific code):

```javascript
// Remove this Qualtrics-specific code:
Qualtrics.SurveyEngine.addOnload(function () { ... });
Qualtrics.SurveyEngine.addOnReady(function () { ... });
Qualtrics.SurveyEngine.addOnUnload(function () { ... });
qthis.hideNextButton();

// Replace with:
window.onload = function() {
    initExp();
};
```

5. **Modify data saving**: Replace Qualtrics embedded data with local storage or server POST:

```javascript
// Instead of:
Qualtrics.SurveyEngine.setEmbeddedData("nBack1FA", ...)

// Use:
localStorage.setItem("nBack1FA", falsealarmCounter.toString());
// OR send to your server:
// fetch('/api/save-results', { method: 'POST', body: JSON.stringify(results) })
```

6. **Open in browser**: Simply open the HTML file in a web browser

### Option 2: Using a Local Server

For better functionality (especially if loading external resources):

```bash
# If you have Python installed:
python -m http.server 8000

# Then visit: http://localhost:8000/nback-test.html
```

### Required External Libraries

The code depends on jsPsych 6.1 libraries hosted on GitHub:
- jsPsych core
- HTML keyboard response plugin
- HTML button response plugin
- Audio keyboard response plugin
- Fullscreen plugin
- CSS stylesheet

These are loaded via `<script>` tags in the HTML.

## How to Incorporate This Code in Qualtrics

The paper provides detailed step-by-step instructions:

### Step 1: Create New Project in Qualtrics

1. Log into Qualtrics (https://login.qualtrics.com)
2. Select **"Create a new project"**
3. Choose **"Survey"** → **"From Scratch"** → **"Get started"**
4. Name your project (e.g., "n-back")
5. Select **"Flow"** → **"Create a Project"**

### Step 2: Program the n-back Task

#### Add JavaScript:
1. In Qualtrics, click **"Add Block"**
2. Select **"Add New Question"** → Choose **"Text/Graphic"**
3. Click **"JavaScript"** (appears after clicking on the question)
4. Select **"Edit Question JavaScript"**
5. Paste the JavaScript code from Appendix A
6. Click **"Save"**

#### Add HTML:
1. In the same question block, click **"HTML View"** (instead of Rich Content Editor)
2. Delete existing HTML
3. Paste the HTML code from Appendix B
4. Click **"Save"**

### Step 3: Set Up Data Collection

1. Before the n-back block, add an **"Embedded Data"** element in Survey Flow
2. Create fields for data you want to collect:
   - `nBack1FA` (1-back false alarms)
   - `nBack1MISS` (1-back misses)
   - `nBack2FA` (2-back false alarms)
   - `nBack2MISS` (2-back misses)
   - `nBack3FA` (3-back false alarms)
   - `nBack3MISS` (3-back misses)

### Step 4: Test and Export

1. Click **"Preview"** to test as a participant
2. Complete the task
3. Go to **"Data & Analysis"**
4. Select **"Export & Import"** → **"Export Data"** → **"Excel"**
5. Download and verify data

### Important Qualtrics-Specific Settings:

- **Hide Next Button**: `qthis.hideNextButton();` prevents accidental progression
- **Full Screen**: Can be toggled for immersive experience
- **Mobile Preview**: Disable with `if (!window.frameElement && !window.Qualtrics)` check
- **Embedded Data**: Uses `Qualtrics.SurveyEngine.setEmbeddedData()` to save scores

## How to Deploy Outside Qualtrics and Build a Web App

To create a standalone web application:

### Architecture Options

#### Option 1: Static Web App (Simple)

**Frontend:**
- HTML/CSS/JavaScript (provided code)
- Host on: GitHub Pages, Netlify, Vercel, or AWS S3

**Backend (for data storage):**
- Not strictly required for testing
- Data saved to browser localStorage
- Can export data manually

**Steps:**
1. Create a GitHub repository
2. Add your HTML, CSS, and JS files
3. Enable GitHub Pages in settings
4. Share the URL with participants

#### Option 2: Full-Stack Web App (Advanced)

**Frontend:**
- React.js or Vue.js application
- Integrate jsPsych as a dependency
- Enhanced UI with modern frameworks

**Backend:**
- Node.js + Express.js server
- Database: PostgreSQL, MongoDB, or MySQL
- RESTful API for data collection

**Steps:**

1. **Initialize Project:**
```bash
npm init
npm install express jspsych mongoose
```

2. **Create Server (server.js):**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to database
mongoose.connect('mongodb://localhost/nback-data');

// API endpoint to save results
app.post('/api/results', (req, res) => {
    // Save req.body to database
    // Return success response
});

app.listen(3000);
```

3. **Modify JavaScript to POST data:**
```javascript
// Replace Qualtrics.SurveyEngine.setEmbeddedData with:
fetch('/api/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        nBack1FA: falsealarmCounter,
        nBack1MISS: missCounter,
        // ... other data
    })
});
```

4. **Deploy:**
- Frontend: Netlify, Vercel, or AWS Amplify
- Backend: Heroku, DigitalOcean, or AWS EC2
- Database: MongoDB Atlas, AWS RDS, or Heroku Postgres

#### Option 3: Modern Framework Integration

**Using React + jsPsych:**

1. **Create React App:**
```bash
npx create-react-app nback-app
cd nback-app
npm install @jspsych/react jspsych
```

2. **Create Component:**
```jsx
import { JsPsychProvider, useJsPsych } from '@jspsych/react';

function NBackTask() {
    const { jsPsych } = useJsPsych();

    // Adapt the code from Appendix A here

    return <div id="jspsych-target"></div>;
}
```

3. **Build and Deploy:**
```bash
npm run build
# Deploy build folder to hosting service
```

### Data Management Considerations

1. **Privacy & GDPR Compliance:**
   - Implement consent forms
   - Anonymize participant data
   - Provide data deletion options
   - Use secure HTTPS connections

2. **Authentication (Optional):**
   - Add user accounts (Firebase Auth, Auth0)
   - Track individual progress
   - Allow participants to resume sessions

3. **Data Export:**
   - Provide CSV/Excel export functionality
   - Real-time dashboard for researchers
   - Automated statistical analysis

4. **Scalability:**
   - Use CDN for static assets
   - Database indexing for queries
   - Caching strategies for performance

### Recommended Tech Stack for Full Web App

**Beginner-Friendly:**
- Frontend: Plain HTML/CSS/JS with jsPsych
- Backend: Firebase (auth, database, hosting all-in-one)
- No traditional backend coding required

**Intermediate:**
- Frontend: React + jsPsych
- Backend: Node.js + Express
- Database: MongoDB Atlas (cloud)
- Hosting: Netlify (frontend) + Heroku (backend)

**Advanced:**
- Frontend: Next.js (React framework with SSR)
- Backend: Node.js + Express or FastAPI (Python)
- Database: PostgreSQL with Prisma ORM
- Hosting: Vercel (frontend) + AWS/DigitalOcean (backend)
- Monitoring: Sentry for error tracking
- Analytics: Custom analytics dashboard

## Additional Resources

- **jsPsych Documentation**: https://www.jspsych.org/
- **Qualtrics Support**: https://www.qualtrics.com/support/
- **Original Paper DOI**: 10.20982/tqmp.19.2.p136
- **Code Repository**: Available on journal website

## Summary

This tutorial makes the n-back cognitive task accessible to researchers without extensive programming knowledge. The provided code can be used in three main ways:

1. **In Qualtrics**: For online research with built-in participant management
2. **Standalone HTML**: For simple, self-contained testing
3. **Web Application**: For custom deployment with enhanced features and data management

The flexibility of the implementation allows researchers to choose the approach that best fits their needs, technical expertise, and research requirements.
