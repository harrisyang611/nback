# N-Back Task Implementation Plan

This document outlines the implementation stages for deploying the n-back cognitive task, based on the tutorial paper by Bradley-Garcia & Bolton (2023).

## Overview

The implementation can follow three main paths:
1. **Qualtrics Integration** - For researchers using Qualtrics platform
2. **Standalone Web Page** - Simple HTML/JS deployment
3. **Full Web Application** - Complete web app with backend and database

## Stage 1: Code Preparation and Setup

### 1.1 Code Extraction ✅
- [x] Extract JavaScript code from Appendix A
- [x] Extract HTML code from Appendix B
- [x] Create separate files: `nback.js` and `nback.html`
- [x] Document code functionality in `details.md`

### 1.2 Environment Setup
Choose your deployment path:

**Option A: Qualtrics**
- [ ] Access Qualtrics account
- [ ] Verify survey creation permissions
- [ ] Review institutional IRB requirements

**Option B: Standalone**
- [ ] Set up local development environment
- [ ] Install web browser for testing
- [ ] Optionally install local server (Python, Node.js)

**Option C: Full Web App**
- [ ] Choose tech stack (see details.md for options)
- [ ] Set up development environment
- [ ] Install required dependencies
- [ ] Set up version control (Git)

## Stage 2: Implementation by Path

### Path A: Qualtrics Implementation

#### 2.1 Qualtrics Project Setup
- [ ] Create new Qualtrics project
- [ ] Name project appropriately
- [ ] Select "Survey" type
- [ ] Choose "From Scratch" option

#### 2.2 Survey Flow Configuration
- [ ] Add "Embedded Data" element before n-back block
- [ ] Create data fields:
  - [ ] `nBack1FA` (1-back false alarms)
  - [ ] `nBack1MISS` (1-back misses)
  - [ ] `nBack2FA` (2-back false alarms)
  - [ ] `nBack2MISS` (2-back misses)
  - [ ] `nBack3FA` (3-back false alarms)
  - [ ] `nBack3MISS` (3-back misses)

#### 2.3 Add Consent Form (Optional but Recommended)
- [ ] Create consent form block
- [ ] Add institutional ethics information
- [ ] Configure consent logic (redirect if declined)

#### 2.4 Add Welcome Message (Optional)
- [ ] Create welcome block with instructions
- [ ] Explain study purpose
- [ ] Provide time estimate (~25 minutes)

#### 2.5 Program N-Back Task
- [ ] Add new question block
- [ ] Select "Text/Graphic" question type
- [ ] Click "JavaScript" in question settings
- [ ] Paste `nback.js` content into JavaScript editor
- [ ] Click "HTML View" in question editor
- [ ] Delete default HTML
- [ ] Paste `nback.html` content
- [ ] Save changes

#### 2.6 Add Thank You Message (Optional)
- [ ] Create end-of-survey message
- [ ] Thank participants
- [ ] Provide debrief information if needed

#### 2.7 Testing
- [ ] Click "Preview" to test as participant
- [ ] Complete entire task
- [ ] Verify all sequences work (1-back, 2-back, 3-back)
- [ ] Check data collection

#### 2.8 Data Export Setup
- [ ] Navigate to "Data & Analysis"
- [ ] Test data export to Excel
- [ ] Verify embedded data appears correctly
- [ ] Document data structure for analysis

#### 2.9 Distribution
- [ ] Generate anonymous survey link
- [ ] Configure survey options (one response per person, etc.)
- [ ] Test link in different browsers
- [ ] Distribute to participants

### Path B: Standalone Web Page Implementation

#### 2.1 Create Standalone HTML File
- [ ] Create new file: `nback-standalone.html`
- [ ] Combine HTML and JavaScript from extracted files
- [ ] Remove Qualtrics-specific code:
  - [ ] Remove `Qualtrics.SurveyEngine.addOnload`
  - [ ] Remove `Qualtrics.SurveyEngine.addOnReady`
  - [ ] Remove `Qualtrics.SurveyEngine.addOnUnload`
  - [ ] Remove `qthis.hideNextButton()`
  - [ ] Remove `qthis.clickNextButton()`

#### 2.2 Modify Initialization
- [ ] Replace Qualtrics initialization with standard JavaScript:
```javascript
window.onload = function() {
    initExp();
};
```

#### 2.3 Implement Data Saving
Choose one:

**Option 1: Local Storage**
- [ ] Replace `Qualtrics.SurveyEngine.setEmbeddedData()` with `localStorage.setItem()`
- [ ] Create function to export data to CSV
- [ ] Add download button for results

**Option 2: Console/Alert**
- [ ] Display results in console or alert dialog
- [ ] User manually copies data

#### 2.4 Testing
- [ ] Open HTML file in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Verify full-screen mode works
- [ ] Verify audio feedback plays
- [ ] Test data saving mechanism

#### 2.5 Hosting (Optional)
Choose one:

**GitHub Pages:**
- [ ] Create GitHub repository
- [ ] Push HTML file to repository
- [ ] Enable GitHub Pages in settings
- [ ] Share public URL

**Simple Web Hosting:**
- [ ] Choose hosting service (Netlify, Vercel, etc.)
- [ ] Upload HTML file
- [ ] Configure domain (optional)
- [ ] Share URL

### Path C: Full Web Application Implementation

#### 2.1 Backend Setup

##### 2.1.1 Initialize Project
- [ ] Create project directory
- [ ] Initialize package manager (npm or yarn)
- [ ] Set up Git repository
- [ ] Create `.gitignore` file

##### 2.1.2 Install Dependencies
**Node.js/Express Stack:**
```bash
npm install express mongoose cors dotenv
npm install --save-dev nodemon
```

**Python/Flask Stack (Alternative):**
```bash
pip install flask flask-cors pymongo python-dotenv
```

##### 2.1.3 Database Setup
- [ ] Choose database (MongoDB, PostgreSQL, MySQL)
- [ ] Set up local database for development
- [ ] Set up cloud database for production (MongoDB Atlas, etc.)
- [ ] Create database schema for results:
  - Participant ID
  - Timestamp
  - nBack1FA, nBack1MISS
  - nBack2FA, nBack2MISS
  - nBack3FA, nBack3MISS
  - Additional demographics (optional)

##### 2.1.4 Create API Endpoints
- [ ] POST `/api/results` - Save n-back results
- [ ] GET `/api/results` - Retrieve results (admin only)
- [ ] POST `/api/consent` - Save consent information
- [ ] GET `/api/export` - Export data to CSV (admin only)

##### 2.1.5 Implement Authentication (Optional)
- [ ] Set up user authentication (JWT, OAuth, etc.)
- [ ] Create admin user for data access
- [ ] Implement participant ID generation

#### 2.2 Frontend Development

##### 2.2.1 Choose Framework
Pick one:
- [ ] Plain HTML/CSS/JavaScript (simplest)
- [ ] React (most popular)
- [ ] Vue.js (easier learning curve)
- [ ] Next.js (React with SSR)

##### 2.2.2 Project Setup

**React Example:**
```bash
npx create-react-app nback-app
cd nback-app
npm install jspsych @jspsych/plugin-html-keyboard-response
```

##### 2.2.3 Convert Code to Framework

**For React:**
- [ ] Create components:
  - [ ] `App.js` - Main application
  - [ ] `NBackTask.js` - N-back task component
  - [ ] `Consent.js` - Consent form component
  - [ ] `Welcome.js` - Welcome screen
  - [ ] `ThankYou.js` - Completion screen
- [ ] Integrate jsPsych with React
- [ ] Set up routing (if multi-page)

##### 2.2.4 Modify Data Handling
- [ ] Replace Qualtrics data saving with API calls:
```javascript
fetch('/api/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        participantId: generateUniqueId(),
        nBack1FA: falsealarmCounter,
        nBack1MISS: missCounter,
        // ... other data
        timestamp: new Date().toISOString()
    })
})
.then(response => response.json())
.then(data => console.log('Results saved:', data))
.catch(error => console.error('Error saving results:', error));
```

##### 2.2.5 Implement UI Enhancements
- [ ] Add loading indicators
- [ ] Add progress bar
- [ ] Add error handling
- [ ] Add responsive design for mobile
- [ ] Add accessibility features (ARIA labels, keyboard navigation)

#### 2.3 Integration and Testing

##### 2.3.1 Local Testing
- [ ] Start backend server
- [ ] Start frontend development server
- [ ] Test complete workflow:
  - [ ] Consent form submission
  - [ ] N-back task completion
  - [ ] Data saving to database
  - [ ] Data retrieval
- [ ] Test error scenarios:
  - [ ] Network disconnection
  - [ ] Database connection failure
  - [ ] Invalid data submission

##### 2.3.2 Cross-Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Test on mobile devices (iOS, Android)

##### 2.3.3 Performance Testing
- [ ] Measure page load time
- [ ] Test with slow network connections
- [ ] Verify audio playback performance
- [ ] Test full-screen functionality

#### 2.4 Deployment

##### 2.4.1 Prepare for Production
- [ ] Set environment variables
- [ ] Configure production database
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Implement analytics (Google Analytics, Plausible)
- [ ] Set up monitoring (UptimeRobot, Pingdom)

##### 2.4.2 Deploy Backend

**Heroku (Easiest):**
- [ ] Create Heroku account
- [ ] Install Heroku CLI
- [ ] Create Heroku app
- [ ] Configure environment variables
- [ ] Push code to Heroku
- [ ] Verify deployment

**AWS/DigitalOcean (More Control):**
- [ ] Set up VPS or EC2 instance
- [ ] Configure server (nginx, Apache)
- [ ] Set up SSL certificate
- [ ] Configure firewall
- [ ] Deploy application
- [ ] Set up automatic backups

##### 2.4.3 Deploy Frontend

**Netlify (Recommended for React/Vue):**
- [ ] Create Netlify account
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Deploy
- [ ] Configure custom domain (optional)

**Vercel (Great for Next.js):**
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Deploy
- [ ] Configure environment variables
- [ ] Set up custom domain (optional)

##### 2.4.4 Post-Deployment
- [ ] Test production URL
- [ ] Verify data is saving correctly
- [ ] Test all user flows
- [ ] Monitor error logs
- [ ] Set up automatic backups

## Stage 3: Data Management and Analysis

### 3.1 Data Collection
- [ ] Monitor incoming data
- [ ] Verify data quality
- [ ] Handle missing data
- [ ] Check for duplicate submissions

### 3.2 Data Export
- [ ] Create export functionality
- [ ] Export to CSV format
- [ ] Include all relevant fields
- [ ] Document data structure

### 3.3 Data Analysis Preparation
- [ ] Clean data
- [ ] Calculate derived variables:
  - [ ] Hit rate per condition
  - [ ] False alarm rate per condition
  - [ ] d' (d-prime) measure
  - [ ] Response time statistics
- [ ] Create analysis-ready dataset

### 3.4 Privacy and Security
- [ ] Anonymize participant data
- [ ] Implement data retention policy
- [ ] Set up secure data storage
- [ ] Document GDPR/privacy compliance
- [ ] Create data deletion mechanism

## Stage 4: Documentation and Maintenance

### 4.1 User Documentation
- [ ] Create participant instructions
- [ ] Write troubleshooting guide
- [ ] Document system requirements
- [ ] Create FAQ

### 4.2 Technical Documentation
- [ ] Document code structure
- [ ] Create API documentation
- [ ] Write deployment guide
- [ ] Document database schema
- [ ] Create maintenance procedures

### 4.3 Version Control
- [ ] Tag releases with version numbers
- [ ] Document changes in CHANGELOG
- [ ] Create backup of working versions

### 4.4 Ongoing Maintenance
- [ ] Monitor error logs
- [ ] Update dependencies
- [ ] Fix bugs as reported
- [ ] Implement user feedback
- [ ] Regular security updates

## Stage 5: Optional Enhancements

### 5.1 Advanced Features
- [ ] Add participant dashboard
- [ ] Implement real-time results visualization
- [ ] Add email notifications for completion
- [ ] Create admin dashboard for monitoring
- [ ] Implement A/B testing for variations

### 5.2 Customization Options
- [ ] Make parameters configurable (stimulus duration, ISI, etc.)
- [ ] Allow different stimulus types (numbers, shapes, etc.)
- [ ] Support multiple languages
- [ ] Add difficulty adjustment based on performance

### 5.3 Research Features
- [ ] Implement counterbalancing
- [ ] Add condition randomization
- [ ] Support multiple experimental groups
- [ ] Integrate with other tasks
- [ ] Add demographic questionnaire

### 5.4 Accessibility Improvements
- [ ] Add screen reader support
- [ ] Implement keyboard-only navigation
- [ ] Add color-blind friendly mode
- [ ] Support for users with motor impairments

## Timeline Estimates

### Qualtrics Path (Fastest)
- **Total Time**: 4-8 hours
- Setup: 1-2 hours
- Implementation: 2-3 hours
- Testing: 1-2 hours
- Documentation: 1 hour

### Standalone Web Page
- **Total Time**: 8-16 hours
- Code modification: 3-4 hours
- Testing: 2-3 hours
- Hosting setup: 1-2 hours
- Documentation: 2-3 hours
- Bug fixes: 2-4 hours

### Full Web Application
- **Total Time**: 40-80 hours (1-2 weeks full-time)
- Backend development: 12-16 hours
- Frontend development: 12-16 hours
- Integration: 4-8 hours
- Testing: 8-12 hours
- Deployment: 4-8 hours
- Documentation: 4-8 hours
- Refinement: 8-16 hours

## Success Criteria

### Minimum Viable Product (MVP)
- [ ] Task runs without errors
- [ ] All three n-back conditions work (1, 2, 3-back)
- [ ] Data is saved correctly
- [ ] Results can be exported
- [ ] Basic instructions are provided

### Production-Ready
- [ ] Tested across multiple browsers
- [ ] Mobile-responsive (if applicable)
- [ ] Error handling implemented
- [ ] User instructions are clear
- [ ] Data privacy measures in place
- [ ] Backup system configured

### Research-Ready
- [ ] IRB approval obtained
- [ ] Informed consent implemented
- [ ] Data collection verified
- [ ] Analysis pipeline established
- [ ] Documentation complete
- [ ] Pilot testing completed successfully

## Risk Management

### Common Issues and Solutions

**Issue**: jsPsych libraries fail to load
- **Solution**: Host libraries locally or use CDN backup

**Issue**: Audio doesn't play on some browsers
- **Solution**: Use multiple audio formats, add user interaction before audio

**Issue**: Full-screen mode blocked
- **Solution**: Add clear instructions, make it optional

**Issue**: Data not saving
- **Solution**: Implement retry logic, add error messages, use local cache

**Issue**: Performance issues on mobile
- **Solution**: Optimize assets, reduce stimulus complexity, test on target devices

**Issue**: Participants drop out
- **Solution**: Add progress indicators, reduce task length, improve instructions

## Next Steps

1. **Choose your implementation path** based on:
   - Technical expertise
   - Available resources
   - Project timeline
   - Budget
   - Research requirements

2. **Follow the stages sequentially** for your chosen path

3. **Test thoroughly** before collecting real data

4. **Document everything** for reproducibility

5. **Start with MVP** and add features incrementally

6. **Pilot test** with small sample before full deployment

## Resources

- **jsPsych Documentation**: https://www.jspsych.org/
- **Qualtrics Support**: https://www.qualtrics.com/support/
- **Original Paper**: Bradley-Garcia, M., & Bolton, V. (2023). DOI: 10.20982/tqmp.19.2.p136
- **Code Repository**: Check journal supplementary materials

## Notes

- Always obtain IRB approval before collecting human subject data
- Test on target population before full deployment
- Keep participant data secure and confidential
- Maintain version control of all code
- Document any modifications to the original code
- Consider consulting with a statistician for data analysis planning
