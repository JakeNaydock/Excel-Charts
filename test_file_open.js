const xlsx = require("xlsx");
const fs = require("fs");
//const jsontoxml = require("jsontoxml");
const path = require('path');

console.log('Current directory name' + '' + __dirname);
var directory_name = __dirname;

let filenames = fs.readdirSync(directory_name);


console.log("\nFilenames in directory:");
filenames.forEach((file) => {
    const _file = path.resolve(directory_name, file);
    console.log(_file);

    //var workbook = xlsx.readFile(_file);
});