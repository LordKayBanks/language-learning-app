function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const range = (start, stop, step = 1) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
export const saveJSONToPC = (jsonData, filename) => {
  let fileData = JSON.stringify(jsonData);
  fileData = `const data = ${fileData}; const dictionary = JSON.parse(data); export default dictionary; `;
  const blob = new Blob([fileData], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  //   link.download = `${filename}.json`;
  link.download = `${filename}.js`;
  link.href = url;
  link.click();
};

async function translate(word) {
  const url = `https://lb.dioco.io:2000/base_dict_getFullDict_4?form=${word}&lemma=&sl=de&tl=en`;
  const response = await fetch(url);
  const { data } = await response.json();
  const { wordExamples, rawDictData } = data;

  const { ms_form, yand_lemma, d_lemma, ms_translate_form, ms_lemma, data_incomplete } = rawDictData;
  const dictData = {
    ms_form: JSON.stringify(ms_form),
    yand_lemma: JSON.stringify(yand_lemma),
    d_lemma: JSON.stringify(d_lemma),
    ms_lemma: JSON.stringify(ms_lemma),
    ms_translate_form,
    data_incomplete
  };
  //   return console.log('dictData: ', dictData);
  const examples = Object.entries(wordExamples).map(([categoryName, categoryValue_]) => {
    const categoryValue = categoryValue_.map(example => {
      const { lEFN_LC, langCode_G, pos, fN_LC, feats, text, nlp, translation } = example;
      //   console.log('#####example: ', example);

      const exampleDetails = nlp
        .filter(({ pos }) => pos !== 'WS')
        .map(({ pos, form, form_norm, lemma, feats, deprel }) => {
          const form_text = form?.text ?? '';
          const form_norm_text = form_norm?.text ?? '';
          const lemma_text = lemma?.text ?? '';
          const details = { pos, form: form_text, ...feats, lemma: lemma_text, deprel, form_norm: form_norm_text };
          return details;
        });
      //   console.log('#####exampleDetails: ', exampleDetails);

      const result = {
        lEFN_LC,
        langCode_G,
        pos,
        fN_LC,
        nlp: JSON.stringify(exampleDetails),
        text,
        translation: translation?.text,
        ...feats
      };
      //   console.log('1.#####result: ', { categoryName, ...result });
      return { categoryName, ...result };
    });
    // console.log('2.#####categoryValue: ', categoryValue);
    return categoryValue;
  });

  const fullApiData = { [word]: { examples: examples.flat(), dictData } };
  //   console.log('3.######examples: ', fullApiData);
  return fullApiData;
}
// translate('heben');

async function translateWordGroup(wordGroup) {
  const result = [];
  const words = wordGroup.querySelectorAll('.lln-words-view-cell');
  //   for (const word of [...words].slice(95)) {
  for (const word of words) {
    const data = await translate(word.textContent.trim());
    result.push(data);
    console.log('#####result: ', result.length);
  }
  // console.log('#####result: ', result);
  return result;
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

  for (const counter of range(0, 80)) {
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
    const data = await translateWordGroup(wordGroup);
    saveJSONToPC(JSON.stringify(data), `de_en-${lastSectionNumber}`);
    // ==============================================>

    window.scrollBy(0, offsetHeight);
    await sleep(1500);
  }
}
execute();
