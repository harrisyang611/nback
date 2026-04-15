# N-Back Cognitive Task - Implementation Package

This package contains a complete implementation of the n-back cognitive task, extracted from the tutorial paper "Programming an n-Back task in Qualtrics using HTML and JavaScript" by Bradley-Garcia & Bolton (2023).

## Files in This Package

### Documentation

- **`details.md`** - Comprehensive explanation of the paper, the n-back task, and implementation instructions
- **`plan.md`** - Step-by-step implementation plan with timelines and success criteria
- **`README.md`** - This file

### Source Code

- **`nback.js`** - JavaScript code for the n-back task (for Qualtrics)
- **`nback.html`** - HTML styling and library imports (for Qualtrics)
- **`nback-standalone.html`** - Complete standalone version that works in any web browser
- **`Qualtrics n-back test.pdf`** - Original research paper with full tutorial

## Quick Start

### Option 1: Run Standalone (Easiest)

1. Simply open `nback-standalone.html` in a web browser (Chrome, Firefox, Safari)
2. Click "Full Screen" to begin
3. Follow the on-screen instructions
4. Results will be displayed at the end and saved to browser localStorage
5. Download results as CSV using the button

### Option 2: Integrate with Qualtrics

1. Read the detailed instructions in `details.md` (section: "How to Incorporate This Code in Qualtrics")
2. Create a new Qualtrics survey project
3. Add a new question block (Text/Graphic type)
4. Copy `nback.js` content into the JavaScript editor
5. Copy `nback.html` content into the HTML view
6. Set up embedded data fields for results
7. Test and deploy

### Option 3: Build a Web Application

1. Review the implementation plan in `plan.md`
2. Choose your tech stack (suggestions provided)
3. Follow Stage 2 (Path C) for full web app development
4. Use `nback-standalone.html` as your starting point
5. Modify data saving to use your backend API

## What is the N-Back Task?

The n-back task is a cognitive test that measures working memory. Participants see a sequence of stimuli (letters) and must indicate when the current stimulus matches one shown **n** positions back:

- **1-back**: Match the stimulus from 1 position ago
- **2-back**: Match the stimulus from 2 positions ago
- **3-back**: Match the stimulus from 3 positions ago

### Task Characteristics

- **Duration**: ~25 minutes for complete task (1-back, 2-back, 3-back)
- **Response**: Press spacebar when stimulus matches
- **Stimuli**: Letters (A, B, C, D, F, H, K, L, M, N, O, P, Q, R, X)
- **Scoring**: Hits, Misses, False Alarms, Correct Rejections

## Features

- Practice sessions with audio feedback
- Progressive difficulty (1-back → 2-back → 3-back)
- Automatic advancement based on performance
- Full-screen mode for immersive testing
- Data export functionality
- Cross-browser compatible

## Requirements

### For Standalone HTML
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- No installation required

### For Qualtrics
- Qualtrics account with survey creation permissions
- JavaScript and HTML editing access

### For Web App Development
- Node.js (v14+) or Python (3.7+)
- Database (MongoDB, PostgreSQL, or MySQL)
- Web hosting service

## Usage Examples

### Running the Standalone Version

```bash
# Simply open in browser (no server needed)
open nback-standalone.html

# OR use a local server
python -m http.server 8000
# Then visit: http://localhost:8000/nback-standalone.html
```

### Accessing Results

Results are stored in:
1. **Browser localStorage** (standalone version)
2. **Qualtrics embedded data** (Qualtrics version)
3. **Your database** (web app version)

Data includes:
- `nBack1FA` - 1-back false alarms
- `nBack1MISS` - 1-back misses
- `nBack2FA` - 2-back false alarms
- `nBack2MISS` - 2-back misses
- `nBack3FA` - 3-back false alarms
- `nBack3MISS` - 3-back misses

## Customization

### Modifying Parameters

Edit these variables in the JavaScript code:

```javascript
var StimDuration = 1500;    // Stimulus display time (ms)
var ISIDuration = 500;      // Inter-stimulus interval (ms)
var nItemsTotal = 30;       // Total items per sequence
var nItemsTarget = 10;      // Number of target matches
var MaxError = 24;          // Max errors before ending
```

### Changing Stimuli

Modify the stimulus variables:

```javascript
var stim1 = '<p style="font-size:30pt">A</p>';
// Can be changed to numbers, images, or other HTML
```

### Adding Languages

Translate text in the instruction objects:

```javascript
var Show_Instr_OneBack = {
    stimulus: "<p>Your translated instructions here</p>",
    // ...
};
```

## Data Analysis

### Calculating Performance Metrics

**Hit Rate**: `Hits / (Hits + Misses)`
**False Alarm Rate**: `False Alarms / (False Alarms + Correct Rejections)`
**d-prime (d')**: `Z(Hit Rate) - Z(False Alarm Rate)`

### Expected Performance

- **1-back**: Easiest, highest accuracy expected
- **2-back**: Moderate difficulty
- **3-back**: Most difficult, lower accuracy expected

## Troubleshooting

### Common Issues

**Problem**: Libraries fail to load
**Solution**: Check internet connection; libraries are hosted on GitHub

**Problem**: Audio doesn't play
**Solution**: Ensure browser allows autoplay; may need user interaction first

**Problem**: Full-screen doesn't work
**Solution**: Some browsers block full-screen; make it optional or add clear instructions

**Problem**: Results not saving
**Solution**: Check browser console for errors; verify localStorage is enabled

### Getting Help

1. Review `details.md` for comprehensive documentation
2. Check `plan.md` for implementation guidance
3. Consult the original paper in `Qualtrics n-back test.pdf`
4. Search jsPsych documentation: https://www.jspsych.org/

## Research Use

### Before Collecting Data

1. ✅ Obtain IRB approval from your institution
2. ✅ Create informed consent form
3. ✅ Pilot test with small sample
4. ✅ Verify data collection works correctly
5. ✅ Document any modifications made
6. ✅ Plan data analysis approach

### Ethical Considerations

- Obtain informed consent
- Protect participant privacy
- Store data securely
- Anonymize data when possible
- Provide option to withdraw
- Share results if appropriate

## Citation

If you use this implementation in your research, please cite:

**Original Paper:**
```
Bradley-Garcia, M., & Bolton, V. (2023). Programming an n-Back task in Qualtrics
using HTML and JavaScript. The Quantitative Methods for Psychology, 19(2), 136-155.
DOI: 10.20982/tqmp.19.2.p136
```

**jsPsych Library:**
```
de Leeuw, J. R. (2015). jsPsych: A JavaScript library for creating behavioral
experiments in a web browser. Behavior Research Methods, 47(1), 1-12.
DOI: 10.3758/s13428-014-0458-y
```

## License

The code in this tutorial is provided by the original authors for educational and research purposes. Please review the original paper for specific licensing terms.

## Additional Resources

- **jsPsych Documentation**: https://www.jspsych.org/
- **jsPsych Examples**: https://www.jspsych.org/7.3/examples/
- **Qualtrics Support**: https://www.qualtrics.com/support/
- **Working Memory Research**: Review references in the original paper

## Version History

- **v1.0** (2023) - Original implementation from Bradley-Garcia & Bolton paper
- **v1.1** (Current) - Added standalone version, enhanced documentation

## Contributing

If you make improvements to this implementation:
1. Document your changes clearly
2. Test thoroughly
3. Consider sharing with the research community
4. Maintain compatibility with the original design

## Support

For questions about:
- **The original tutorial**: Contact the paper authors
- **jsPsych functionality**: Visit jsPsych forum or documentation
- **Qualtrics integration**: Contact Qualtrics support
- **This implementation package**: Review documentation files

## Acknowledgments

- Original authors: Meenakshie Bradley-Garcia & Victoria Bolton
- jsPsych creator: Josh de Leeuw
- University of Ottawa, School of Psychology

---

**Last Updated**: March 2024
**Package Version**: 1.1
**Based On**: Bradley-Garcia & Bolton (2023), TQMP 19(2)
