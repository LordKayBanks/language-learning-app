function getSentenceText(url) {
  const urlSearchParams = new URLSearchParams(url);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params.text;
}

const saveJSONToPC = (jsonData, filename) => {
  let fileData = JSON.stringify(jsonData);
  fileData = `const data = ${fileData}; export default data; `;
  const blob = new Blob([fileData], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  //   link.download = `${filename}.json`;
  link.download = `${filename}.mjs`;
  link.href = url;
  link.click();
};

let resultTracker = [];
let currentWordExamples = [];
let lastProcessedWord = '';
(function (open) {
  XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
    if (this.readyState === 0 && url.toString().includes('base_cached_getSentenceTts_3')) {
      const currentWord = window.language_currentWord;
      const currentSentence = window.language_currentSentence;

      if (lastProcessedWord !== currentWord && lastProcessedWord !== '') {
        resultTracker.push({ [lastProcessedWord]: currentWordExamples });
        currentWordExamples = [{ url, currentSentence }];
        console.log('Different:ResultTracker: ', [...resultTracker]);
      } else {
        currentWordExamples.push({ url, currentSentence });
        console.log('Same || first-time: ', [...currentWordExamples]);
        // currentWordExamples.push({ url, currentSentence: JSON.stringify(currentSentence) });
      }
      lastProcessedWord = currentWord;
      open.call(this, method, 'null', async, user, pass);
      //   console.log('XMLHttpRequest: ', currentWordExamples);
      return;
    }
    open.call(this, method, url, async, user, pass);
  };
})(XMLHttpRequest.prototype.open);
// =======================================================================================
// =======================================================================================

const sleepDuration = 1200;
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const range = (start, stop, step = 1) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

function play() {
  var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
  audio.loop = true;
  audio.play();
  return audio;
}

async function getAllSentences(word, { currentCategoryIndex, currentWordIndex }) {
  word.click();
  await sleep(sleepDuration);

  const exampleSentences = document.querySelector('.lln-word-examples')?.querySelectorAll('.lln-word-example') ?? [];
  window.language_prefix = `${currentCategoryIndex}.${currentWordIndex}.${word.textContent}`;
  window.language_currentWord = word.textContent;

  exampleSentences.forEach(async example => {
    window.language_currentSentence = example.textContent;
    example.querySelector('.lr-play-btn').click();
    await sleep(200);
  });
}

async function extractWordsFromGroup(wordGroup, currentCategoryIndex) {
  const words = wordGroup.querySelectorAll('.lln-words-view-cell');
  for (const [index, word] of [...words].slice(0, 5).entries()) {
    //   for (const [index, word] of [...words].slice(0, 100).entries()) {
    await getAllSentences(word, { currentCategoryIndex, currentWordIndex: index + 1 });
    console.log('#####Test: ', index);
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

  for (const counter of range(0, 5)) {
    //   for (const counter of range(0, 80)) {
    if (document.hidden) {
      const player = play();
      await sleep(3000);
      confirm('Do you want to continue?');
      player.pause();
    }

    while (lastSectionNumber + 1 < counter) {
      let sectionInfo = getlastSectionInfo();
      (lastSectionNumber = sectionInfo[0]), (offsetHeight = sectionInfo[1]);
      window.scrollBy(0, offsetHeight);
      await sleep(1000);
      console.log('still in the loop: catching-up', lastSectionNumber, ' counter: ', counter);
    }

    let sectionInfo = getlastSectionInfo();
    (lastSectionNumber = sectionInfo[0]), (offsetHeight = sectionInfo[1]);
    const wordGroupSelector = `[data-index="${lastSectionNumber}"]`;
    let wordGroup = document.querySelector(wordGroupSelector);

    while (wordGroup === null) {
      await sleep(2000);
      wordGroup = document.querySelector(wordGroupSelector);
      console.log('....stuck inside the loop: ', wordGroup, ' is', ' null');
    }
    console.log('#####passed: lastSectionNumber: ', lastSectionNumber, ' counter: ', counter);

    // ==============================================>
    await extractWordsFromGroup(wordGroup, counter + 1);
    saveJSONToPC(resultTracker, counter);
    console.log('#####ResultTracker: ', resultTracker);
    resultTracker = [];
    // ==============================================>

    window.scrollBy(0, offsetHeight);
    await sleep(1500);
  }
}
execute();
