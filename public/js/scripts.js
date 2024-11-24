// Wait for the page to load
window.onload = function () {
    // Fetch data from the server
    fetch('/api/chart-data')
        .then((response) => response.json())
        .then((data) => {
            // Process the data for the chart
            console.log('Chart data: ', data);
            const labels = ['Food Total', 'Gas Total', 'Bill total']
            const values = Object.values(data);
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
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        })
        .catch((error) => console.error('Error fetching chart data:', error));
};
