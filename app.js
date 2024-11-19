const xlsx = require('xlsx');
const fs = require('fs');
//const jsontoxml = require("jsontoxml");
const path = require('path');
const http = require('http');
const { log } = require('console');
const { LogarithmicScale } = require('chart.js');


// Handle routes and API logic
function handleRoutes(req, res) {
    if (req.url === '/api/data') {
        // Example API response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Hello from the server!' }));
        return true;
    }
    return false;
}

function serveStaticFile(res, filePath, contentType, responseCode = 200) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Server Error');
        } else {
            res.writeHead(responseCode, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

// Create the server
const server = http.createServer((req, res) => {
    // Handle API or dynamic routes
    if (handleRoutes(req, res)) return;

    // Serve static files
    const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpeg'; break;
        case '.ico': contentType = 'image/x-icon'; break;
    }

    fs.stat(filePath, (err, stats) => {
        console.log('Requested filepath', filePath);
        if (!err && stats.isFile()) {
            serveStaticFile(res, filePath, contentType);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404: File Not Found');
        }
    });
});

// Server listens on port 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});









/*
const server = http.createServer((req, res) => {
    let filePath = '';

    // Serve index.html
    if (req.url === '/' || req.url === '/index.html') {
        filePath = path.join(__dirname, 'public', 'index.html');
        try {
            serveStaticFile(res, filePath, 'text/html');
        } catch (error) {
            console.log('Caught error serving static file: ', error);
        }

    }


    // Serve scripts.js
    else if (req.url === '/scripts.js') {
        filePath = path.join(__dirname, 'public', 'scripts.js');
        console.log('Req url is script.js, file path: ', filePath);
        serveStaticFile(res, filePath, 'application/javascript');
    }
    // Serve 404 for any other route
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - File Not Found');
    }
});



BEGIN EXCEL LOGIC BELOW:

console.log('Current directory name' + '' + __dirname);
//var directoryName = __dirname;

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