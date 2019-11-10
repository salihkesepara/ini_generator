const fs = require('fs');
const readline = require('readline');
const messages = require('./constants/messages');
const inputs = './inputs';

let inputFile;
let inputFileName;
let outputFileName;
let params;

require.extensions['.ini'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

console.group(`${messages.inputFiles}: `)
fs.readdirSync(inputs).forEach(file => {
  console.info(file);
});
console.groupEnd();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function generateFile() {
  // Get file
  let outputFile = inputFile;

  // Generate file
  params.forEach((item) => {
    const regExp = new RegExp(`${item.id}`, 'g');
    outputFile = outputFile.replace(regExp, item.value);
  });

  // Input file root name
  const fileRoot = `./outputs/${outputFileName}.ini`;

  // Write file in output folder
  fs.writeFile(fileRoot, outputFile, (err) => {
    if (err) throw err;
    console.log(`--> File saved! --> outputs/${outputFileName}.ini`);
    process.exit();
  });
}

function ask(query) {
  return new Promise(function (resolve, reject) {
    rl.question(query, function (answer) {
      resolve(answer, reject);
    });
  });
}

async function run() {
  try {
    inputFileName = await ask(`${messages.inputMessage}: `);
    inputFile = require(`./inputs/${inputFileName}.ini`);
  } catch (e) {
    console.log(messages.inputFileErrorMessage);
    run();
    return;
  }

  try {
    params = require(`./params/${inputFileName}`);
  } catch (e) {
    console.log(messages.paramsErrorMessage);
    run();
    return;
  }

  outputFileName = await ask(`${messages.outputMessage}: `);

  for (let i = 0; i < params.length; i++) {
    params[i].value = await ask(`${params[i].name}: `);
  }

  generateFile();
}

run();