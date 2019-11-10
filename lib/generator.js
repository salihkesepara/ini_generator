const fs = require('fs');
const inputs = require('./constants/inputs');
const readline = require('readline');
require.extensions['.ini'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Input file root name
const fileRoot = './output/4s4o_fiba_faktoring.ini';

// Get file
const fiba_faktoring = require("./utils/4s4o_fiba_faktoring.ini");
let output = fiba_faktoring;

function generateFile() {
  // Generate file
  inputs.forEach((item) => {
    const regExp = new RegExp(`${item.id}`, 'g');
    output = output.replace(regExp, item.value);
  });

  // Write file in output folder
  fs.writeFile(fileRoot, output, (err) => {
    if (err) throw err;
    console.log('--> File saved! <--');
    process.exit();
  });
}

function getAnswer(query) {
  return new Promise(function (resolve, reject) {
    rl.question(query, function (answer) {
      resolve(answer, reject);
    });
  });
}

async function run() {
  for(let i = 0 ; i < inputs.length ; i++) {
    inputs[i].value = await getAnswer(`${inputs[i].name}: `);
  }

  generateFile();
}

run();