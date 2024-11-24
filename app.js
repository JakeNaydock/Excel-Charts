const xlsx = require('xlsx');
const fs = require('fs');
//const jsontoxml = require("jsontoxml");
const path = require('path');
const http = require('http');
const { log } = require('console');
const { LogarithmicScale } = require('chart.js');
const chart = require('./public/js/chart');

// Create server to handle requests
const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'public', req.url);
    const ext = path.extname(filePath).toLowerCase();

    if (req.url === '/api/chart-data' && req.method === 'GET') {
        // Serve the JSON data
        const data = getChartData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } else if (req.url === '/' && req.method === 'GET') {
        // Serve your index.html file
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url.startsWith('/js') && req.method === 'GET') {
        // Serve JavaScript files
        fs.readFile(path.join(__dirname, 'public', req.url), (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(content);
            }
        });
    } else if (ext === '.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

// Server listens on port 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

function getChartData() {
    console.log('Current directory name' + '' + __dirname);
    //var directoryName = __dirname;

    let filename = 'finances.xlsx';
    console.log('File name', filename);


    const workbook = xlsx.readFile(filename);
    const sheetNameList = workbook.SheetNames;

    const arrSheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
    console.log(arrSheetData);
    let firstRow = arrSheetData[0];

    console.log('First row data \n', firstRow);

    let chartData = [];
    for (let i = 0; i < arrSheetData.length; i++) {

        let expense = arrSheetData[i].Expense;
        let amount = arrSheetData[i].Amount;
        let category = arrSheetData[i].Category;

        console.log('Chart data length: ', chartData.length);
        if (!chartData.length) {
            chartData.push({
                label: category,
                total: amount
            });
            continue;
        }
        for (let j = 0; j < chartData.length; j++) {
            if (chartData[j].label === category) {
                console.log(`Category ${category} matches chart data label ${chartData[j].label}`);
                chartData[j].total += amount;
                continue;
            } else if (j === chartData.length - 1) {
                chartData.push({
                    label: category,
                    total: amount
                });
                break;
            }
        }

        let intDate = arrSheetData[i].Date;
        let date = convertExcelDate(intDate);
        //console.log(`Date converted on line ${i}: ${date}`);
    }
    console.log('Chart data: ', chartData);
    return chartData;
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