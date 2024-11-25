// Wait for the page to load
window.onload = function () {
    // Fetch data from the server
    fetch('/api/chart-data')
        .then((response) => response.json())
        .then((data) => {
            // Process the data for the chart
            console.log('Chart data: ', data);
            //const labels = ['Food Total', 'Gas Total', 'Bill total'];
            const labels = data.map((category) => category.label);
            const values = data.map((category) => category.total);
            console.log('Values: ', values);
            // Create the chart
            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'bar', // Chart type
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Excel Data',
                        data: values,
                        backgroundColor: barColors,
                        borderColor: borderColors,
                        borderWidth: 1,
                    }],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                    responsive: false
                },
            });
        })
        .catch((error) => console.error('Error fetching chart data:', error));
};

const barColors = [
    'rgba(241, 106, 106, 0.822)',//light red
    'rgba(49, 214, 214, 0.507)', //light blue
    'rgba(161, 168, 62, 0.863)' //yellow
];

const borderColors = [
    'rgba(255, 1, 1, 0.822)', //red
    'rgba(9, 243, 243, 0.116)', //blue
    'rgba(216, 230, 26, 0.616)' //yellow
];
