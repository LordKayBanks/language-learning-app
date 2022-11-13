import fs from 'fs';

import { default as dict0 } from './de_en-0.mjs';
import { default as dict1 } from './de_en-1.mjs';
import { default as dict2 } from './de_en-2.mjs';
import { default as dict3 } from './de_en-3.mjs';
import { default as dict4 } from './de_en-4.mjs';
import { default as dict5 } from './de_en-5.mjs';
import { default as dict6 } from './de_en-6.mjs';
import { default as dict7 } from './de_en-7.mjs';
import { default as dict8 } from './de_en-8.mjs';
import { default as dict9 } from './de_en-9.mjs';
import { default as dict10 } from './de_en-10.mjs';
import { default as dict11 } from './de_en-11.mjs';
import { default as dict12 } from './de_en-12.mjs';
import { default as dict13 } from './de_en-13.mjs';
import { default as dict14 } from './de_en-14.mjs';
import { default as dict15 } from './de_en-15.mjs';
import { default as dict16 } from './de_en-16.mjs';
import { default as dict17 } from './de_en-17.mjs';
import { default as dict18 } from './de_en-18.mjs';
import { default as dict19 } from './de_en-19.mjs';
import { default as dict20 } from './de_en-20.mjs';
import { default as dict21 } from './de_en-21.mjs';
import { default as dict22 } from './de_en-22.mjs';
import { default as dict23 } from './de_en-23.mjs';
import { default as dict24 } from './de_en-24.mjs';
import { default as dict25 } from './de_en-25.mjs';
import { default as dict26 } from './de_en-26.mjs';
import { default as dict27 } from './de_en-27.mjs';
import { default as dict28 } from './de_en-28.mjs';
import { default as dict29 } from './de_en-29.mjs';
import { default as dict30 } from './de_en-30.mjs';
import { default as dict31 } from './de_en-31.mjs';
import { default as dict32 } from './de_en-32.mjs';
import { default as dict33 } from './de_en-33.mjs';
import { default as dict34 } from './de_en-34.mjs';
import { default as dict35 } from './de_en-35.mjs';
import { default as dict36 } from './de_en-36.mjs';
import { default as dict37 } from './de_en-37.mjs';
import { default as dict38 } from './de_en-38.mjs';
import { default as dict39 } from './de_en-39.mjs';
import { default as dict40 } from './de_en-40.mjs';
import { default as dict41 } from './de_en-41.mjs';
import { default as dict42 } from './de_en-42.mjs';
import { default as dict43 } from './de_en-43.mjs';
import { default as dict44 } from './de_en-44.mjs';
import { default as dict45 } from './de_en-45.mjs';
import { default as dict46 } from './de_en-46.mjs';
import { default as dict47 } from './de_en-47.mjs';
import { default as dict48 } from './de_en-48.mjs';
import { default as dict49 } from './de_en-49.mjs';
import { default as dict50 } from './de_en-50.mjs';
import { default as dict51 } from './de_en-51.mjs';
import { default as dict52 } from './de_en-52.mjs';
import { default as dict53 } from './de_en-53.mjs';
import { default as dict54 } from './de_en-54.mjs';
import { default as dict55 } from './de_en-55.mjs';
import { default as dict56 } from './de_en-56.mjs';
import { default as dict57 } from './de_en-57.mjs';
import { default as dict58 } from './de_en-58.mjs';
import { default as dict59 } from './de_en-59.mjs';
import { default as dict60 } from './de_en-60.mjs';
import { default as dict61 } from './de_en-61.mjs';
import { default as dict62 } from './de_en-62.mjs';
import { default as dict63 } from './de_en-63.mjs';
import { default as dict64 } from './de_en-64.mjs';
import { default as dict65 } from './de_en-65.mjs';
import { default as dict66 } from './de_en-66.mjs';
import { default as dict67 } from './de_en-67.mjs';
import { default as dict68 } from './de_en-68.mjs';
import { default as dict69 } from './de_en-69.mjs';
import { default as dict70 } from './de_en-70.mjs';
import { default as dict71 } from './de_en-71.mjs';
import { default as dict72 } from './de_en-72.mjs';
import { default as dict73 } from './de_en-73.mjs';
import { default as dict74 } from './de_en-74.mjs';
import { default as dict75 } from './de_en-75.mjs';
import { default as dict76 } from './de_en-76.mjs';
import { default as dict77 } from './de_en-77.mjs';
import { default as dict78 } from './de_en-78.mjs';
import { default as dict79 } from './de_en-79.mjs';

const dictData = [
  dict0,
  dict1,
  dict2,
  dict3,
  dict4,
  dict5,
  dict6,
  dict7,
  dict8,
  dict9,
  dict10,
  dict11,
  dict12,
  dict13,
  dict14,
  dict15,
  dict16,
  dict17,
  dict18,
  dict19,
  dict20,
  dict21,
  dict22,
  dict23,
  dict24,
  dict25,
  dict26,
  dict27,
  dict28,
  dict29,
  dict30,
  dict31,
  dict32,
  dict33,
  dict34,
  dict35,
  dict36,
  dict37,
  dict38,
  dict39,
  dict40,
  dict41,
  dict42,
  dict43,
  dict44,
  dict45,
  dict46,
  dict47,
  dict48,
  dict49,
  dict50,
  dict51,
  dict52,
  dict53,
  dict54,
  dict55,
  dict56,
  dict57,
  dict58,
  dict59,
  dict60,
  dict61,
  dict62,
  dict63,
  dict64,
  dict65,
  dict66,
  dict67,
  dict68,
  dict69,
  dict70,
  dict71,
  dict72,
  dict73,
  dict74,
  dict75,
  dict76,
  dict77,
  dict78,
  dict79
];

function formatJSOnData(data) {
  return data.reduce((accum, entry) => {
    const [data] = Object.entries(entry);
    const [key, value] = data;
    const newValue = value?.examples.map(({ text, translation }) => ({ text, translation }));
    accum[key] = newValue;
    return accum;
  }, {});
}
let counter = 0;
function convertToJSON() {
  for (const dict of dictData) {
    const directory = `de_en_json/`;
    if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
    const filePath = `${directory}de_en${counter}.json`;
    fs.writeFile(filePath, JSON.stringify(formatJSOnData(dict)), function (err) {
      if (err) throw err;
      //   console.log('complete');
    });
    counter++;
  }
}
convertToJSON();

export default dictData;
