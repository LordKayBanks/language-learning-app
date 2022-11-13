/* eslint-disable no-undef */
function sleep(ms) {
  // add ms millisecond timeout before promise resolution
  return new Promise(resolve => setTimeout(resolve, ms));
}

const checkElement = async selector => {
  if (selector instanceof String) {
    while (document.querySelector(selector) === null) {
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
    return document.querySelector(selector);
  }
  while (selector === null) {
    await new Promise(resolve => requestAnimationFrame(resolve));
  }
  return selector;
};

async function getExampleTranslations(example) {
  const event = new MouseEvent('mouseover', {
    view: window,
    bubbles: true,
    cancelable: true
  });

  example.dispatchEvent(event);
  await sleep(500);
  const tooltips = [...document.querySelectorAll("[role='tooltip']")];
  const currentTooltip = tooltips[tooltips.length - 1];
  await checkElement(currentTooltip);
  return currentTooltip.textContent;
}
const result = [];

async function getDataFromWord(targetWord) {
  const contextualTranslation = document.querySelector('.lln-dict-contextual-trans').textContent.split(',');
  const dictionaryPronunciation = document.querySelector('.dictionary-transcription').textContent;
  const dictionaryPartOfSpeech = document.querySelector('.dictionary-pos').textContent;

  const dicMeanings = document.querySelectorAll('.dictionary-meanings-item');
  const otherMeanings = [...dicMeanings].map(meaningItem => {
    const otherMeaning = meaningItem.querySelectorAll('div');
    const otherMeaningValue = otherMeaning[0].textContent;
    const otherMeaningTranslation = otherMeaning[1].textContent;
    const result = { meaning: otherMeaningValue.trim(), translation: otherMeaningTranslation.trim() };
    return result;
  });

  const dicContainer = document.querySelectorAll('.lln-word-examples');
  const exampleSentences = dicContainer[0].querySelectorAll('.lln-word-example');
  //   const extractExamples = [...exampleSentences].map(item => item.textContent);
  const extractExamples = [];
  for (example of exampleSentences) {
    const translation = await getExampleTranslations(example);
    extractExamples.push({ sentence: example.textContent, translation: translation });
  }

  const result = {
    targetWord: targetWord,
    translation: contextualTranslation,
    pronunciation: dictionaryPronunciation,
    partOfSpeech: dictionaryPartOfSpeech,
    otherMeanings: otherMeanings,
    examples: extractExamples
  };
  return result;
}

let counter = 0;
const endGroup = 79;
async function scrapeData() {
  //   document.querySelector(`[data-index="${counter}"]`).scrollIntoView(false);
  const wordGroup = document.querySelector(`[data-index="${counter}"]`);
  if (!wordGroup) {
    const selector = `[data-index="${counter + 1}"]`;
    await checkElement(selector);
    document.querySelector(selector).scrollIntoView(false);
    return setTimeout(() => scrapeData(), 500);
  }

  const words = wordGroup.querySelectorAll('.lln-words-view-cell');
  for (const word of [...words].slice(99)) {
    //   for (const word of words) {
    const targetWord = word.textContent;
    word.click();
    await checkElement('.lln-full-dict');
    await checkElement('.lln-dict-contextual-trans');
    await checkElement('.dictionary-transcription');
    await checkElement('.dictionary-pos');
    await checkElement('.dictionary-meanings-item');
    await sleep(200);
    const translation = await getDataFromWord(targetWord);
    result.push(translation);
  }
  console.log('result: ', result);
  words[words.length - 1].scrollIntoView();
  await sleep(2000);

  counter++;
  if (counter < endGroup) return scrapeData();
}
scrapeData();
