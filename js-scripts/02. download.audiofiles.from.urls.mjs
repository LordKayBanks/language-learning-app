import fs from 'fs';
import atob from 'atob';
import fetch from 'node-fetch';
import util from 'util';
//
import entireURLsArray from '../de_dict_audiofiles/index.mjs';

function padWithZero(num, targetLength = 3) {
  return String(num).padStart(targetLength, '0');
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function convertURIToBinary(dataURI) {
  let BASE64_MARKER = ';base64,';
  let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  let base64 = dataURI.substring(base64Index);
  let raw = atob(base64);
  let rawLength = raw.length;
  let arr = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    arr[i] = raw.charCodeAt(i);
  }
  return arr;
}

async function downloadAudioFile(data, filename = 'unknown') {
  let binary = convertURIToBinary(data);
  const fs_writeFile = util.promisify(fs.writeFile);
  await fs_writeFile(`${filename}.mp3`, binary);

  //   try {
  //     fs.writeFileSync(`${filename}.mp3`, binary);
  //   } catch ({ code }) {
  //     if (code === 'ENAMETOOLONG') {
  //       const fixedFileLength = filename.substring(0, 250);
  //       fs.writeFileSync(`${fixedFileLength}.mp3`, binary);
  //     }
  //   }
}

let sectionCounter = 77;
let exampleCounter = 0;
async function makeApiCall(sentenceObj, sectionCounter) {
  const directory = `de_example_sentences/folder_${sectionCounter}`;
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

  const sentenceEntries = Object.entries(sentenceObj);
  let [responseData] = sentenceEntries;
  [responseData] = sentenceEntries;
  const [word, examples] = responseData;
  //===================================
  //   for (let { currentSentence, url } of examples) {
  //     try {
  //       const response = await fetch(url);
  //       const { data } = await response.json();
  //       console.log('response: ', response);
  //       console.log('data: ', data);
  //       if (currentSentence.length > 200) {
  //         currentSentence = currentSentence.substring(0, 200);
  //       }
  //       await downloadAudioFile(data, `${directory}/${exampleCounter}.${word}--${currentSentence}`);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     exampleCounter++;
  //   }
  //   =================================

  const sentenceTitles = [];
  const requestArray = [];
  for (const { currentSentence, url } of examples) {
    sentenceTitles.push([currentSentence, exampleCounter]);
    requestArray.push(fetch(url).then(response => response.json()));
    exampleCounter++;
  }
  try {
    const responseArray = await Promise.allSettled(requestArray);
    responseArray.forEach(async ({ value }, index) => {
      const { data } = value;
      //   console.log('data: ', data);
      let [currentSentence, exampleCounter] = sentenceTitles[index];
      if (currentSentence.length > 200) {
        currentSentence = currentSentence.substring(0, 200);
      }
      await downloadAudioFile(data, `${directory}/${padWithZero(exampleCounter)}. ${word}--${currentSentence}`);
    });
  } catch (error) {
    console.log(error);
  }
  //===============================================
}

async function execute() {
  for (const sectionURLsArray of entireURLsArray) {
    exampleCounter = 0;
    for (const file of sectionURLsArray) {
      await makeApiCall(file, sectionCounter);
      //   await sleep(500);
    }
    sectionCounter++;
    console.log(sectionCounter);
  }
}
execute();
