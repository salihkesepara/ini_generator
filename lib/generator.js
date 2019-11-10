const fs = require('fs');
const inputs = require('./constants/inputs');
const readline = require('readline');
require.extensions['.ini'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

let fileName = '';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Get file
const fiba_faktoring = require("./utils/fiba_faktoring.ini");
let output = fiba_faktoring;

function generateFile() {
  // Generate file
  inputs.forEach((item) => {
    const regExp = new RegExp(`${item.id}`, 'g');
    output = output.replace(regExp, item.value);
  });

  // Input file root name
  const fileRoot = `./output/${fileName}.ini`;

  // Write file in output folder
  fs.writeFile(fileRoot, output, (err) => {
    if (err) throw err;
    console.log('--> File saved! <--');
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
  fileName = await ask('Output file name: ');

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = await ask(`${inputs[i].name}: `);
  }

  generateFile();
}

run();