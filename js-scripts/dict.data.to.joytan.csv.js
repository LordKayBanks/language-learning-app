const saveJSONToPC = (dataArray, filename) => {
  const csvHeader = 'atop, def-1, def-2, def-3, def-4, ex-1, ex-2, ex-3\r\n';
  let csvLine = csvHeader;

  for (const item of dataArray) {
    const data = Object.entries(item);
    const [translationData] = data;
    const [word, translationWithExamples] = translationData;
    const { dictData, examples } = translationWithExamples;
    let { d_lemma, ms_form, yand_lemma } = dictData;
    const { dict = [] } = (d_lemma = JSON.parse(d_lemma));

    let translations = [];
    for (const entry of dict || []) {
      translations.push({ pos: entry.pos, translation: entry.translations });
    }
    // console.log({ d_lemma, ms_form, yand_lemma });
    //==================
    console.log('translations', translations);
    csvLine += `${word}, ${translations
      .filter((_, index) => index < 4)
      .map(item => item.translation ?? '')
      .flat()
      .join(' | ')},${examples[0]?.translation?.replaceAll(',', '‚')},${examples[1]?.translation?.replaceAll(
      ',',
      '‚'
    )},${examples[2]?.translation?.replaceAll(',', '‚') ?? ''},${examples[0]?.text?.replaceAll(
      ',',
      '‚'
    )},${examples[1]?.text?.replaceAll(',', '‚')},${examples[2]?.text?.replaceAll(',', '‚')}},`;
    csvLine += '\r\n';
  }
  //=====================

  const blob = new Blob([csvLine], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${filename}.csv`;
  link.href = url;
  link.click();
};

saveJSONToPC(dictionary, 'dictionary');
