const path = require('path');
const fs = require('fs');

// const files = fs
//   .readdirSync(__dirname, { withFileTypes: true })
//   .filter(item => !item.isDirectory())
//   .map(item => item.name);
// console.log(files);

function parseFile() {
  const resultArray = [];
  const array = fs.readFileSync(path.join(__dirname, 'file.txt')).toString().split('\n');

  array.forEach((stringToParse, index) => {
    let [germanPart, englishPart] = stringToParse.split('⇓⇓');
    germanPart = germanPart.replace(/”|“|"/g, '').split('💎')[1];
    resultArray.push([germanPart, englishPart]);
  });
  //   console.log(resultArray);
  return resultArray;
}
function chunkArrayInto100s(data = []) {
  const chunkedArray = [];
  let tempArray = [];
  data.forEach((item, index) => {
    if (index !== 0 && index % 100 === 0) {
      chunkedArray.push(tempArray);
      tempArray = [item];
    } else {
      tempArray.push(item);
    }
  });
  chunkedArray.push(tempArray);
  return chunkedArray;
}

function arrayToCSV(entries = [], fileName = '100') {
  const filePath = path.join(__dirname, `${fileName}.csv`);
  const writeStream = fs.createWriteStream(filePath);
  entries.forEach((entry, index) => {
    writeStream.write(`"${index + 1}. ${entry[0]}", "${entry[1]}", vocabulary-tag\n`);
  });
}

const data = chunkArrayInto100s(parseFile());
arrayToCSV(data[0], '2000 Most Common German Words in Context-0-99');
// console.log(data);

// arrayToCSV(parseFile(), '2000 Most Common German Words in Context');
