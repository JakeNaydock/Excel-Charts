const xlsx = require('xlsx');
const fs = require('fs');
//const jsontoxml = require("jsontoxml");
const path = require('path');
const http = require('http');

const server = http.createServer((req, res) => {
    // Set the response header (status code and content type)
    res.writeHead(200, { 'Content-Type': 'text/html' });

    // Write the response body
    res.write('<h1>Hello</h1>');

    // End the response
    res.end();
});

// Server listens on port 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


console.log('Current directory name' + '' + __dirname);
var directoryName = __dirname;

let filename = 'finances.xlsx';
console.log('File name', filename);


const workbook = xlsx.readFile(filename);
console.log('Workbook object: \n', workbook);
//const workSheetsFromFile = xlsx.parse(`${directoryName}/myFile.xlsx`);
//console.log('Worksheet from file', workSheetsFromFile);
const sheetNameList = workbook.SheetNames;
console.log('Sheet name list: ' + '\n', sheetNameList);

const arrSheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
console.log(arrSheetData);
let firstRow = arrSheetData[0];

console.log('First row data \n', firstRow);

for (let i = 0; i < arrSheetData.length; i++) {
    let intDate = arrSheetData[i].Date;
    console.log(`Date as integer on line ${i}: ${intDate}`);

    let date = convertExcelDate(intDate);
    console.log(`Date converted on line ${i}: ${date}`);

}

function convertExcelDate(excelSerialDate) {
    // Excel starts from January 1, 1900, which corresponds to serial date 1.
    // In JavaScript, dates start from 1970-01-01 (Unix epoch), so we adjust accordingly.
    const excelEpoch = new Date(1899, 11, 30); // Excel considers 1900-01-01 as day 1.
    const daysOffset = excelSerialDate * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    const date = new Date(excelEpoch.getTime() + daysOffset); // Add offset to the epoch

    // Format the date as MM/DD/YYYY
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return formattedDate;
}



/*
filenames.forEach((file) => {
    const _file = path.resolve(directoryName, file);
    console.log(_file);

    //var workbook = xlsx.readFile(_file);
});
*/