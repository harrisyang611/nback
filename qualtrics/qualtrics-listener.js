/*
  Paste this into the Qualtrics question's JavaScript editor.
  Delete the default stub before pasting.
*/

Qualtrics.SurveyEngine.addOnReady(function () {
    var qthis = this;

    // Diagnostic: log which embedded-data methods exist in this Qualtrics runtime
    console.log('[nback] API check:', {
        'Qualtrics.SurveyEngine.setJSEmbeddedData': typeof Qualtrics.SurveyEngine.setJSEmbeddedData,
        'Qualtrics.SurveyEngine.setEmbeddedData':   typeof Qualtrics.SurveyEngine.setEmbeddedData,
        'qthis.setJSEmbeddedData':                  typeof qthis.setJSEmbeddedData,
        'qthis.setEmbeddedData':                    typeof qthis.setEmbeddedData
    });

    qthis.hideNextButton();

    function setED(name, value) {
        if (typeof Qualtrics.SurveyEngine.setJSEmbeddedData === 'function') {
            Qualtrics.SurveyEngine.setJSEmbeddedData(name, value);
        } else if (typeof qthis.setJSEmbeddedData === 'function') {
            qthis.setJSEmbeddedData(name, value);
        } else {
            Qualtrics.SurveyEngine.setEmbeddedData(name, value);
        }
    }

    function handleMessage(event) {
        if (!event.data || event.data.type !== 'nback-complete') return;
        var d = event.data;
        console.log('[nback] message received:', JSON.stringify(d));

        try {
            setED('nBackLevel',         d.nbackLevel    || '');
            setED('nBackFA',            d.nBackFA       || '0');
            setED('nBackMiss',          d.nBackMISS     || '0');
            setED('nBackHits',          d.hits          || '0');
            setED('nBackAccuracy',      d.accuracy      || '0');
            setED('nBackAvgRT',         d.avgRT         || '');
            setED('nBackParticipantId', d.participantId || '');
            console.log('[nback] embedded data written via:', typeof Qualtrics.SurveyEngine.setJSEmbeddedData === 'function' ? 'static setJSEmbeddedData' : typeof qthis.setJSEmbeddedData === 'function' ? 'instance setJSEmbeddedData' : 'deprecated setEmbeddedData');
        } catch(e) {
            console.error('[nback] write error:', e);
        }

        window.removeEventListener('message', handleMessage);
        qthis.showNextButton();
        setTimeout(function () { qthis.clickNextButton(); }, 200);
    }

    window.addEventListener('message', handleMessage);
});

Qualtrics.SurveyEngine.addOnUnload(function () {});
