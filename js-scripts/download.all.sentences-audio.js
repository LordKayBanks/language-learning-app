function getSentenceText(url) {
  const urlSearchParams = new URLSearchParams(url);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params.text;
}

function convertURIToBinary(dataURI) {
  let BASE64_MARKER = ';base64,';
  let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  let base64 = dataURI.substring(base64Index);
  let raw = window.atob(base64);
  let rawLength = raw.length;
  let arr = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    arr[i] = raw.charCodeAt(i);
  }
  return arr;
}

function downloadAudioFile(data, sentence = 'sentence') {
  const prefix = window.language_prefix ?? '';

  let binary = convertURIToBinary(data);
  let blob = new Blob([binary], {
    type: 'audio/mp3'
  });
  let blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = `${prefix}__${sentence}-B.mp3`;
  link.href = blobUrl;
  link.click();
}

const resultTracker = [];
(function (open) {
  XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
    this.addEventListener(
      'readystatechange',
      function () {
        const sentenceText = getSentenceText(url);
        const hasDownloaded = sentenceText && resultTracker[sentenceText];
        // if (!hasDownloaded && url.toString().includes('base_cached_getSentenceTts_3') && this.readyState === 4) {
        if (url.toString().includes('base_cached_getSentenceTts_3') && this.readyState === 4) {
          window.language_isProcessing = '';
          const { data } = JSON.parse(this.response);
          downloadAudioFile(data, sentenceText);
          //   resultTracker[sentenceText] = true;
          resultTracker.push(`${window.language_currentWord}-${sentenceText}`);
          window.language_isProcessing = sentenceText;
          console.info('XMLHttpRequest: ', sentenceText);
        }
      },
      false
    );

    open.call(this, method, url, async, user, pass);
  };
})(XMLHttpRequest.prototype.open);
// =======================================================================================
// =======================================================================================

const sleepDuration = 5000;
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const range = (start, stop, step = 1) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

const Beep = (function () {
  const ctx = new (AudioContext || webkitAudioContext)();

  return function (duration, freq, finishedCallback) {
    duration = +duration;
    if (typeof finishedCallback != 'function') {
      finishedCallback = function () {};
    }
    let osc = ctx.createOscillator();
    osc.type = 0;
    osc.connect(ctx.destination);
    osc.frequency.value = freq;

    if (osc.start) osc.start();
    else osc.noteOn(0);

    setTimeout(function () {
      if (osc.stop) osc.stop(0);
      else osc.noteOff(0);
      finishedCallback();
    }, duration);
  };
})();

async function getAllSentences(word, { currentCategoryIndex, currentWordIndex }) {
  word.click();
  await sleep(sleepDuration);

  const exampleSentences = document.querySelector('.lln-word-examples').querySelectorAll('.lln-word-example');
  window.language_prefix = `${currentCategoryIndex}.${currentWordIndex}.${word.textContent}`;
  window.language_currentWord = word.textContent;

  let previousSentence = '';
  exampleSentences.forEach(async example => {
    const hasPreviousSentenceDownloaded = window.language_isProcessing === previousSentence;
    const isItFirstTime = window.language_isProcessing === '1st-time';
    while (!hasPreviousSentenceDownloaded && !isItFirstTime) {
      console.log('ExampleSentences.language_isProcessing: ', window.language_isProcessing);
      await sleep(sleepDuration);
    }
    console.info('exampleSentences: ', example.textContent);
    previousSentence = example.textContent;
    example.querySelector('.lr-play-btn').click();
  });
}
// async function getAllSentences(word, { currentCategoryIndex, currentWordIndex }) {
//   word.click();
//   await sleep(sleepDuration);

//   const [_, ...exampleCategories] = [
//     ...document.querySelectorAll(
//       '#root > main > div.MuiDrawer-root.MuiDrawer-docked.jss8.jss12.css-1tu59u4 > div > div.lln-full-dict > div:nth-child(9) > div:nth-child(1) > div > div'
//     )
//   ];
//   exampleCategories.forEach(category => {
//     // const pos = category.querySelector('.lln-word-examples-title-pos');
//     // const posPrefix = `-${pos?.textContent}`;
//     window.language_prefix = `${currentCategoryIndex}.${currentWordIndex}.${word.textContent}`;
//     const exampleSentences = [...category.querySelectorAll('.lln-word-example')];
//     console.log('exampleSentences', exampleSentences);

//     exampleSentences.forEach(async example => {
//       example.querySelector('.lr-play-btn').click();
//       //   await sleep(sleepDuration);
//       while (!window.language_isProcessing) await sleep(sleepDuration);
//     });
//   });
// }

async function extractWordsFromGroup(wordGroup, currentCategoryIndex) {
  const words = wordGroup.querySelectorAll('.lln-words-view-cell');
  //   for (const [index, word] of [...words].slice(0, 1).entries()) {
  for (const [index, word] of [...words].slice(0, 100).entries()) {
    await getAllSentences(word, { currentCategoryIndex, currentWordIndex: index + 1 });
    console.log('#####test: ', index);
  }
}
// translateWordGroup(document.querySelector(`[data-index="0"]`))

function getlastSectionInfo() {
  let sections = [...document.querySelectorAll('[data-index]')];
  let lastSection = sections[sections.length - 1];
  let lastSectionNumber = parseInt(lastSection.dataset.index);
  let { offsetHeight } = lastSection;
  return [lastSectionNumber, offsetHeight];
}

async function execute() {
  //   range(0, 80)
  window.scroll(0, 300);
  await sleep(2000);
  let [lastSectionNumber, offsetHeight] = getlastSectionInfo();

  //   for (const counter of range(0, 5)) {
  for (const counter of range(0, 80)) {
    Beep(2000, 666);
    confirm('Do you want to continue?');

    while (lastSectionNumber + 1 < counter) {
      let sectionInfo = getlastSectionInfo();
      (lastSectionNumber = sectionInfo[0]), (offsetHeight = sectionInfo[1]);
      window.scrollBy(0, offsetHeight);
      await sleep(1000);
      console.log('continue: lastSectionNumber: ', lastSectionNumber, ' counter: ', counter);
    }

    let sectionInfo = getlastSectionInfo();
    (lastSectionNumber = sectionInfo[0]), (offsetHeight = sectionInfo[1]);
    const wordGroupSelector = `[data-index="${lastSectionNumber}"]`;
    let wordGroup = document.querySelector(wordGroupSelector);

    while (wordGroup === null) {
      await sleep(2000);
      wordGroup = document.querySelector(wordGroupSelector);
      console.log('....after: ', wordGroup);
    }
    console.log('#####passed: lastSectionNumber: ', lastSectionNumber, ' counter: ', counter);

    // ==============================================>
    await extractWordsFromGroup(wordGroup, counter + 1);
    // ==============================================>

    window.scrollBy(0, offsetHeight);
    await sleep(1500);
  }
}
window.language_isProcessing = '1st-time';
execute();
