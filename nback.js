/*
 * N-Back Task JavaScript Code
 * Extracted from: "Programming an n-Back task in Qualtrics using HTML and JavaScript"
 * Bradley-Garcia, M., & Bolton, V. (2023). The Quantitative Methods for Psychology, 19(2), 136-155.
 *
 * This code implements a cognitive n-back task using jsPsych version 6.1
 * It can be used in Qualtrics or adapted for standalone web applications
 */

Qualtrics.SurveyEngine.addOnload(function () {
    /* Appending the display_stage Div using jQuery */
    if (document.getElementById("display_stage")) {
        console.log("Found prior to creation");
    } else {
        console.log("Not found prior to creation");
        jQuery("<div id = 'display_stage_background'></div>").appendTo("body");
        jQuery("<div id = 'display_stage'></div>").appendTo("body");
    }
});

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed */
    /* Hide the Next button */
    var qthis = this;
    qthis.hideNextButton();

    if (
        window.Qualtrics &&
        (!window.frameElement || window.frameElement.id !== "mobile-preview-view")
    ) {
        initExp();
    }

    /* jsPsych.init() in a function */
    function initExp() {
        // General parameters
        var StimDuration = 1500;
        var ISIDuration = 500;
        var nItemsTotal = 30;
        var nItemsTarget = 10;
        var nLeadingDistr = 3;
        var currentnback = 0; //currentcondition
        var MaxError = 24; //
        var currentTrial = 0;
        // Create n stimulus objects --just a location--- or letters ---html code-->.
        var nstim = 15;
        var stim1 = '<p style="font-size:30pt">A</p>';
        var stim2 = '<p style="font-size:30pt">B</p>';
        var stim3 = '<p style="font-size:30pt">C</p>';
        var stim4 = '<p style="font-size:30pt">D</p>';
        var stim5 = '<p style="font-size:30pt">F</p>';
        var stim6 = '<p style="font-size:30pt">H</p>';
        var stim7 = '<p style="font-size:30pt">K</p>';
        var stim8 = '<p style="font-size:30pt">L</p>';
        var stim9 = '<p style="font-size:30pt">M</p>';
        var stim10 = '<p style="font-size:30pt">N</p>';
        var stim11 = '<p style="font-size:30pt">O</p>';
        var stim12 = '<p style="font-size:30pt">P</p>';
        var stim13 = '<p style="font-size:30pt">Q</p>';
        var stim14 = '<p style="font-size:30pt">R</p>';
        var stim15 = '<p style="font-size:30pt">X</p>';
        // create an array of stimuli for convenient programming
        var ListOfStimuli = [
            stim1,
            stim2,
            stim3,
            stim4,
            stim5,
            stim6,
            stim7,
            stim8,
            stim9,
            stim10,
            stim11,
            stim12,
            stim13,
            stim14,
            stim15,
        ];

        // an audio file with woohoo sound
        var snd = new Audio("https://rmg2424.github.io/Dr.-Mid-Nite/woohoo2.wav");
        snd.volume = 0.15;

        /*
        <!-- ****************************** --->
        <!-- Toggle full screen on or off --->
        <!-- ****************************** --->
        */

        var FullScreenOn = {
            type: "fullscreen",
            message:
                "<p>The screen will enter fullscreen mode when you press the button...</p>",
            button_label: "Full Screen",
            fullscreen_mode: true,
        };
        var FullScreenOff = {
            type: "fullscreen",
            fullscreen_mode: false,
        };

        /*
        <!-- ****************************** --->
        <!-- * Welcome & Bye * --->
        <!-- ****************************** --->
        */
        var Show_Bye = {
            type: "html-button-response",
            stimulus: "<p>Thank you for completing this task! </p>",
            choices: ["Continue"],
        };

        /*
        <!-- ****************************** --->
        <!-- * Defining instructions * --->
        <!-- ****************************** --->
        */
        var Show_Ready = {
            type: "html-button-response",
            stimulus:
                "<p>You are now ready to continue the task! </p><p>Reminder: For this study, there are 3 tasks: first you will be asked to identify which letter appeared <b>1 letter previously</b> then <b>2 letters previously</b>, and finally <b>3 letters previously </b>. During these tasks, you will not hear a sound indicating whether you have the correct or incorrect response. Please do not take breaks during a trial. It's okay if you miss some items, just keep going and do the best you can!</p><p>Select 'Continue' to begin.</p>",
            choices: ["Continue"],
        };

        var Show_Instr_OneBack = {
            type: "html-button-response",
            stimulus:
                "<p>In this task you must indicate whether the letter presented is the same as the letter presented <b>one letter</b> before. During the practice session, a sound will occur after the letter disappears to let you know if you answered correctly. </p><p>Click continue to start the <b>one letter</b> sequence</p>",
            choices: ["Continue"],
        };
        var Show_Instr_TwoBack = {
            type: "html-button-response",
            stimulus:
                "You are now ready for the next task! Please indicate whether the letter being presented is the same as the letter presented <b>two letters</b> before by pressing <b>space</b> as quickly as possible. </p><p>Click continue to start the <b>two letters</b> sequence.</p>",
            choices: ["Continue"],
        };
        var Show_Instr_ThreeBack = {
            type: "html-button-response",
            stimulus:
                "<p>You are now ready for the next task! Please indicate whether the letter being presented is the same as the letter presented <b>three letters</b> ago by pressing <b>space</b> as quickly as possible. </p><p>Click continue to start the <b>three letters</b> sequence.</p>",
            choices: ["Continue"],
        };

        /*
        <!-- ****************************** --->
        <!-- * Defining random trials * --->
        <!-- ****************************** --->
        */
        // fill an array with a value; from https :// stackoverflow .com/questions/1295146
        function fillArray(value, len) {
            var arr = [];
            for (var i = 0; i < len; i++) {
                arr.push(value);
            }
            return arr;
        }
        // shuffle the array randomly; from https :// stackoverflow .com/questions/2450954
        function shuffle(array) {
            var currentIndex = array.length,
                temporaryValue,
                randomIndex;
            // While there remain elements to shuffle ...
            while (0 !== currentIndex) {
                // Pick a remaining element ...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }
        function createTrials(ntarget, ndistractorr) {
            var distractors = fillArray("distractor", ndistractorr - nLeadingDistr);
            var headdistrs = fillArray("distractor", nLeadingDistr);
            var targets = fillArray("target", ntarget);
            // using concat to concatenate two arrays
            var total = targets.concat(distractors);
            total = shuffle(total);
            //adding nLeadingDistr distractors at beginning of block
            total = headdistrs.concat(total);
            return total;
        }
        // alternate case of the html stimuli
        function altercase(ArrayStimuli) {
            var i = 0;
            var result = ArrayStimuli;

            for (i = 0; i < result.length; i++) {
                if (i % 2 == 0) {
                    result[i].stimulus = result[i].stimulus.toLowerCase();
                } else {
                    result[i].stimulus = result[i].stimulus.toUpperCase();
                }
            }
            return result;
        }
        // Set array of items according to array of conditions in a n−back sequence.
        function createObjectsToRun(condBlock, n) {
            var stimArray = [];
            var i = 0;
            var los = shuffle(ListOfStimuli);
            var pos = n; // position in the shuffled list
            // select the first n items from the shuffled list
            for (i = 0; i < n; i++) {
                stimArray.push({ stimulus: los[i], condition: condBlock[i] });
            }
            for (i = n; i < condBlock.length; i++) {
                if (condBlock[i] === "distractor") {
                    // select an item who is different than n before
                    while (los[pos] == stimArray[i - n].stimulus) {
                        pos = (pos + 1) % nstim;
                    }
                    stimArray.push({ stimulus: los[pos], condition: condBlock[i] });
                    pos = (pos + 1) % nstim;
                } else {
                    // create an item that is the same as n before
                    stimArray.push({
                        stimulus: stimArray[i - n].stimulus,
                        condition: condBlock[i],
                    });
                }
            }
            console.log("createObjectsToRun returned ", stimArray);
            return altercase(stimArray);
        }
        // generate dummy practice and full block
        var randomtrials = createTrials(nItemsTarget, nItemsTotal - nItemsTarget);
        var BackArray = createObjectsToRun(randomtrials, 1);
        var randomtrials = createTrials(4, 6);
        var PractArray = createObjectsToRun(randomtrials, 1);

        /*
        <!-- ****************************** --->
        <!-- * Showing the stimuli * --->
        <!-- ****************************** --->
        */
        var ShowStimulus = {
            type: "html-keyboard-response", // for image, use image−keyboard−response
            stimulus: function () {
                return BackArray[currentTrial].stimulus;
            },
            prompt: function () {
                return (
                    "<br>Press <b>space</b> to indicate if it is the letter shown <b>" +
                    currentnback +
                    " item(s)</b> previously..."
                );
            },
            choices: [" "],
            trial_duration: ISIDuration + StimDuration,
            stimulus_duration: StimDuration,
            response_ends_trial: false,
            data: { Condition: jsPsych.timelineVariable("condition") },
        };

        /*
        <!-- ****************************** --->
        <!-- * Defining practice blocks * --->
        <!-- ****************************** --->
        */
        var Set_PracticeArray = {
            type: "call-function",
            func: function () {
                currentTrial = 0;
                currentnback++;
                randomtrials = createTrials(4, 6);
                BackArray = createObjectsToRun(randomtrials, currentnback);
            },
        };

        function Provide_Feedback(trial_data) {
            if (BackArray[currentTrial].condition == "target") {
                if (trial_data.key_press == 32) {
                    snd.play();
                }
            }
            currentTrial += 1;
        }
        var Run_Practice = {
            timeline: [ShowStimulus],
            timeline_variables: PractArray,
            data: { block: "practice-one-back" },
            on_finish: Provide_Feedback,
        };

        var Show_Continue = {
            type: "html-button-response",
            stimulus: "<p>Ready to go again?</p>",
            choices: ["Continue"],
        };

        var Ask_Retry = {
            type: "html-button-response",
            stimulus: "<p>Good practice!</p>",
            choices: ["Continue", "Practice more"],
        };

        var Practice_Loop = {
            timeline: [
                Set_PracticeArray,
                Run_Practice,
                Ask_Retry
            ],
            loop_function: function(data) {
                const vals = data.values();
                return vals[vals.length - 1].button_pressed === '1';
            }
        };

        /*
        <!-- ****************************** --->
        <!-- * Defining Block OneBack * --->
        <!-- ****************************** --->
        */
        // have two specific form of errors in addition to total error
        var mistakeCounter = 0;
        var falsealarmCounter = 0;
        var missCounter = 0;

        var Reset_Counter = {
            type: "call-function",
            func: function () {
                mistakeCounter = 0;
                falsealarmCounter = 0;
                missCounter = 0;
            },
        };
        var Set_BackArray = {
            type: "call-function",
            func: function () {
                currentTrial = 0;

                randomtrials = createTrials(nItemsTarget, nItemsTotal - nItemsTarget);
                BackArray = createObjectsToRun(randomtrials, currentnback);
            },
        };
        function Record_Decision(trial_data) {
            var correct;
            var type;

            if (BackArray[currentTrial].condition == "target") {
                correct = trial_data.key_press == 32; // 32 == space
            } else {
                correct = trial_data.key_press == null;
            }
            // keep count of the total number of mistake
            if (correct) {
                jsPsych.data.addDataToLastTrial({ correct: 1 });
            } else {
                jsPsych.data.addDataToLastTrial({ correct: 0 });
                mistakeCounter++;
            }

            // record separately hits and false alarms
            if (BackArray[currentTrial].condition == "target") { //hit or miss
                if (correct) {
                    jsPsych.data.addDataToLastTrial({ hit: 1 });
                    type = "Hit";
                } else {
                    jsPsych.data.addDataToLastTrial({ hit: 0 });
                    type = "Miss";
                    missCounter++;
                }
            } else { // correct rejection or false alarm
                if (correct) {
                    jsPsych.data.addDataToLastTrial({ CR: 1 });
                    type = "Correct rejection";
                } else {
                    jsPsych.data.addDataToLastTrial({ CR: 0 });
                    type = "False alarm";
                    falsealarmCounter++;
                }
            }
            currentTrial += 1;

            console.log(
                "Nombre d'erreur ", mistakeCounter, "; current nback: ", currentnback,
                " (type of response: ", type, ")"
            );
        }
        // Save scores at the end of three block of a given "currentnback" condition
        var Save_Scores = {
            type: "call-function",
            func: function () {
                Qualtrics.SurveyEngine.setEmbeddedData(
                    "nBack".concat(currentnback).concat("FA"), falsealarmCounter.toString()
                );
                Qualtrics.SurveyEngine.setEmbeddedData(
                    "nBack".concat(currentnback).concat("MISS"), missCounter.toString()
                );
            },
        };
        var Run_Block_Back = {
            timeline: [ShowStimulus],

            timeline_variables: BackArray,
            data: { block: "block-back" },
            on_finish: Record_Decision,
        };

        /*
        <!-- ****************************** --->
        <!-- * Defining Block Two/ThreeBack * --->
        <!-- ****************************** --->
        */
        // the next blocks are conditional ones. If person made more than
        // 10 mistakes in the previous block, the second will not appear.
        var OneBlock_TwoBack_Run = {
            timeline: [
                Show_Instr_TwoBack,
                Practice_Loop,
                Reset_Counter,

                Set_BackArray,
                Run_Block_Back,

                Set_BackArray,      Show_Continue,
                Run_Block_Back,

                Set_BackArray,
                Show_Continue,
                Run_Block_Back,

                Save_Scores,
            ],
            conditional_function: function () {
                console.log(
                    "nombre d'erreur avant OneBlock_TwoBack_Run",
                    mistakeCounter
                );
                if (mistakeCounter > MaxError) {
                    return false;
                } else {
                    return true;
                }
            },
        };
        var OneBlock_ThreeBack_Run = {
            timeline: [
                Show_Instr_ThreeBack,
                Practice_Loop,
                Reset_Counter,

                Set_BackArray,      Show_Continue,
                Run_Block_Back,

                Set_BackArray,
                Show_Continue,
                Run_Block_Back,

                Set_BackArray,
                Show_Continue,
                Run_Block_Back,

                Save_Scores,
            ],
            conditional_function: function () {
                console.log(
                    "nombre d'erreur avant OneBlock_ThreeBack_Run",
                    mistakeCounter
                );
                if (mistakeCounter > MaxError) {
                    return false;
                } else {
                    return true;
                }
            },
        };

        /*
        <!-- ****************************** --->
        <!-- * Defining Experiment * --->
        <!-- ****************************** --->
        */
        jsPsych.init({
            timeline: [
                FullScreenOn,
                Show_Instr_OneBack,
                Practice_Loop,
                Reset_Counter,

                Set_BackArray,
                Show_Ready,
                Run_Block_Back,


                Set_BackArray,
                Show_Continue,
                Run_Block_Back,


                Set_BackArray,
                Show_Continue,
                Run_Block_Back,
                Save_Scores,

                OneBlock_TwoBack_Run,
                OneBlock_ThreeBack_Run,
                FullScreenOff,
                Show_Bye,
            ],
            display_element: "display_stage",
            on_finish: function () {
                console.log("Performing on_finish");
                //performing some save here?

                console.log("Saved the results");
                // clear the stage
                //jQuery('display_stage ').remove();
                //jQuery('display_stage_background').remove();

                // stimulate click on Qualtrics "next" button, making use of the Qualtrics JS API
                qthis.clickNextButton();

                console.log("on_finish says Ok");
            },
        });
    }
});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/
});
