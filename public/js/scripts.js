// This script is for the chart rendering logic

// Ensure Chart.js is loaded before this code runs
window.onload = function () {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar', // Chart type (bar chart)
        data: {
            labels: ['Food', 'Gas', 'Bills', 'Cat3', 'Cat4', 'Cat5'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


    console.log('Current directory name' + '' + __dirname);
    //var directoryName = __dirname;

    let filename = 'finances.xlsx';
    console.log('File name', filename);


    const workbook = xlsx.readFile(filename);
    //console.log('Workbook object: \n', workbook);
    //const workSheetsFromFile = xlsx.parse(`${directoryName}/myFile.xlsx`);
    //console.log('Worksheet from file', workSheetsFromFile);
    const sheetNameList = workbook.SheetNames;
    //console.log('Sheet name list: ' + '\n', sheetNameList);

    const arrSheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
    console.log(arrSheetData);
    let firstRow = arrSheetData[0];

    console.log('First row data \n', firstRow);
    let foodTotal = 0;
    let gasTotal = 0;
    let billTotal = 0;



    for (let i = 0; i < arrSheetData.length; i++) {

        let expense = arrSheetData[i].Expense;
        let amount = arrSheetData[i].Amount;
        //console.log(`Date as integer on line ${i}: ${intDate}`);
        if (expense === 'Food') {
            foodTotal += amount;
        } else if (expense === 'Gas') {
            gasTotal += amount;
        } else if (expense.includes('Bill')) {
            billTotal += amount;
        }

        let intDate = arrSheetData[i].Date;
        let date = convertExcelDate(intDate);
        //console.log(`Date converted on line ${i}: ${date}`);
    }
    console.log(`Food Total: ${foodTotal}\n Gas Total: ${gasTotal}\n Bills Total: ${billTotal}`);

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













};


